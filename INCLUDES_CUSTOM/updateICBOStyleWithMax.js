/**
 * Designed for Phased Item Fee but will work for any ICBO_STYLE without companion fee that has a Max value
 * @param fcode String Fee Code
 * @param fsched String Fee Schedule
 * @param fperiod String Fee Period
 * @param fqty number (float or int)
 * @param finvoice String "Y" or "N"
 * @param pDuplicate Sting "Y" or "N" (optional - will assume Yes)
 * @param pFeeSeq int Specific fee sequence number to update (optional)
 * @returns feeSeq int - Fee Sequence number of new fee item
 */
function updateICBOStyleWithMax(fcode, fsched, fperiod, fqty, finvoice, pDuplicate, pFeeSeq) {
	try {
		if (pDuplicate == null || pDuplicate.length == 0)
			pDuplicate = "Y";
		else
			pDuplicate = pDuplicate.toUpperCase();

		recalcFees = getAppSpecific("Recalc Fees");
		if (appTypeArray && appTypeArray[0] == "Building")
			bModule = true;
		else
			bModule = false;
		if (bModule) {
			if (recalcFees != "Yes") {
				logDebug("Not updating fees because ASI field Recalc Fees is not yes");
				return;
			}
		} else {
			if (recalcFees == "No") {
				logDebug("Not updating fees because ASI field Recalc Fees is no");
				return;
			}
		}

		var invFeeFound = false;
		var adjustedQty = fqty;
		var feeSeq = null;
		feeUpdated = false;

		if (pFeeSeq == null)
			getFeeResult = aa.finance.getFeeItemByFeeCode(capId, fcode, fperiod);
		else
			getFeeResult = aa.finance.getFeeItemByPK(capId, pFeeSeq);

		if (getFeeResult.getSuccess()) {
			if (pFeeSeq == null)
				var feeList = getFeeResult.getOutput();
			else {
				var feeList = new Array();
				feeList[0] = getFeeResult.getOutput();
			}

			for (feeNum in feeList) {
				if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
					invFeeItem = feeList[feeNum];
					invFeeObj = loadOneFee(invFeeItem);
					if (pDuplicate == "Y") {
						if (invFeeObj.code == fcode) {
							removeFee(fcode, fperiod); // remove any NEW fees that might exist
							currentAmt = feeAmount(fcode, "INVOICED"); // get amount of all fees for this fee code
							currentQty = getFeeQty(fcode);

							refFeeDef = getFeeDefByCode(fsched, fcode);
							logDebug(refFeeDef.calcProc);
							feeCodeMax = refFeeDef.feeMax;
							logDebug("Max value of : " + feeCodeMax);
							newAmt = calcICBOFeeWPrecision(refFeeDef.formula, parseFloat(fqty), 2);

							//logic here to address max
							if (newAmt < feeCodeMax) {
								logDebug("Current amt = " + currentAmt + " current qty = " + currentQty + " new amt = " + newAmt + " new qty = " + fqty);
								diffAmt = newAmt - currentAmt;
								diffQty = fqty - currentQty;
							} else if ((currentAmt + newAmt) > feeCodeMax) {
								newAmt = feeCodeMax;
								diffAmt = newAmt - currentAmt;
								diffQty = feeCodeMax - currentAmt;
								logDebug("Current amt = " + currentAmt + " current qty = " + currentQty + " New amt exceeds max.  Assessing up to: " + feeCodeMax + " based on new qty = " + fqty);
							} else {
								logDebug("Current amt = " + currentAmt + " current qty = " + currentQty + " new amt = " + newAmt + " new qty = " + fqty);
								diffAmt = newAmt - currentAmt;
								diffQty = fqty - currentQty;
							}

							logDebug("Difference in amt = " + diffAmt + " difference in qty = " + diffQty);
							// need to add a new fee using amount difference.
							if (roundNumber(diffAmt, 2) != 0) {
								invFeeItem.setFeeCod(fcode);
								//invFeeItem.setFeeCalcProc("FEE_MULTIPLIER");
								//invFeeItem.setFormula("1");
								invFeeItem.setFeeitemStatus("NEW");
								invFeeItem.setFeeUnit(diffAmt);
								invFeeItem.setFee(diffAmt);
								invFeeItem.setFeeSeqNbr(0);
								invFeeItem.getF4FeeItem().setAdjusted("N");
								invFeeItem.getF4FeeItem().setParentFeeItemSeqNbr(0);
								updateResult = aa.finance.createFeeItem(invFeeItem.getF4FeeItem(), 0);
								if (updateResult.getSuccess()) {
									logDebug("Fee item created");
								} else {
									logDebug("Error updating fee item : " + updateResult.getErrorMessage());
								}
								invFeeFound = true;
								return; // done
							} else {
								return;
							}

						} else {
							logDebug("Invoiced fee " + fcode + " found, subtracting invoiced amount from update qty.");
							adjustedQty = adjustedQty - feeList[feeNum].getFeeUnit();
							invFeeFound = true;
						}
					} else {
						invFeeFound = true;
						logDebug("Invoiced fee " + fcode + " found.  Not updating this fee. Not assessing new fee " + fcode);
					}
				}

				if (feeList[feeNum].getFeeitemStatus().equals("NEW")) {
					adjustedQty = adjustedQty - feeList[feeNum].getFeeUnit();
				}
			}

			for (feeNum in feeList)
				if (feeList[feeNum].getFeeitemStatus().equals("NEW") && !feeUpdated) { // update this fee item
					var feeSeq = feeList[feeNum].getFeeSeqNbr();
					var editResult = aa.finance.editFeeItemUnit(capId, adjustedQty + feeList[feeNum].getFeeUnit(), feeSeq);
					feeUpdated = true;
					if (editResult.getSuccess()) {
						logDebug("Updated Qty on Existing Fee Item: " + fcode + " to Qty: " + fqty);
						if (finvoice == "Y") {
							feeSeqList.push(feeSeq);
							paymentPeriodList.push(fperiod);
						}
					} else {
						logDebug("**ERROR: updating qty on fee item (" + fcode + "): " + editResult.getErrorMessage());
						break
					}
				}
		} else {
			logDebug("**ERROR: getting fee items (" + fcode + "): " + getFeeResult.getErrorMessage())
		}

		// Add fee if no fee has been updated OR invoiced fee already exists and duplicates are allowed
		if (!feeUpdated && adjustedQty != 0 && (!invFeeFound || invFeeFound && pDuplicate == "Y"))
			feeSeq = addFee(fcode, fsched, fperiod, adjustedQty, finvoice);
		else
			feeSeq = null;
		updateFeeItemInvoiceFlag(feeSeq, finvoice);
		return feeSeq;

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateICBOStyleWithMax: " + err.message + "In line number: " + err.lineNumber);
	}
}
