updateSGFee(fcode, fsched, SubGrp)
 {
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
	var adjustedQty = 1;
	var feeSeq = null;
	feeUpdated = false;
	pDuplicate = "Y";
	finvoice = "N";
	fqty = 1;

	var tmpSubGrpFeeAmtNew = getSubGrpFeeAmt(SubGrp, "NEW", fcode);
	var tmpSubGrpFeeAmtInv = getSubGrpFeeAmt(SubGrp, "INVOICED", fcode);

	if (tmpSubGrpFeeAmtInv == 0 && tmpSubGrpFeeAmtNew == 0) {
		if (feeExists(fcode)) {
			// surcharge amt is zero but fee exists, reduce it to zero.
			logDebug("Reducing existing fee amount to zero");
			reduceFeeAmtToZero(fcode, fsched, "STANDARD")
		} else {
			return; // nothing to do here
		}
	}
	getFeeResult = aa.finance.getFeeItemByFeeCode(capId, fcode, "STANDARD");
	if (getFeeResult.getSuccess()) {
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList) {
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
				invFeeItem = feeList[feeNum];
				invFeeObj = loadOneFee(invFeeItem);
				if (pDuplicate == "Y") {
					if (invFeeObj.code == fcode || (companionCheck && invFeeObj.code == companionFeeCode)) {

						removeFee(fcode, invFeeObj.period); // remove any NEW fees that might exist
						currentAmt = feeAmount(fcode, "INVOICED"); // get amount of all fees for this fee code
						currentQty = getFeeQty(fcode);
						refFeeDef = getFeeDefByCode(fsched, fcode);
						newAmt = calcSGPercentageFee(refFeeDef.formula, SubGrp, fcode);
						logDebug("Current amt = " + currentAmt + " current qty = " + currentQty + " new amt = " + newAmt + " new qty = " + fqty);
						diffAmt = newAmt - currentAmt;
						diffQty = fqty - currentQty;
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
						paymentPeriodList.push("STANDARD");
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
		feeSeq = addFee(fcode, fsched, "STANDARD", adjustedQty, finvoice);
	else
		feeSeq = null;
	updateFeeItemInvoiceFlag(feeSeq, finvoice);
	return feeSeq;
}