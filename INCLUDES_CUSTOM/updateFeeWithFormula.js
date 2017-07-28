function updateFeeWithFormula(fcode, fsched, fperiod, fqty, finvoice, pDuplicate, pFeeSeq) {
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
		companionCheck = false;
		companionFeeCode = null;
		companionFeePeriod = "STANDARD";

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

			if (matches(fcode, "B_MECH_031", "B_STR_006", "B_STR_031", "B_STR_056")) {
				// look for companion fee
				switch (fcode) {
				case "B_MECH_031":
					companionFeeCode = "B_MECH_030";
					break;
				case "B_STR_006":
					companionFeeCode = "B_STR_005";
					companionFeePeriod = "FINAL";
					break;
				case "B_STR_031":
					companionFeeCode = "B_STR_030";
					companionFeePeriod = "FINAL";
					break;
				case "B_STR_056":
					companionFeeCode = "B_STR_055";
					companionFeePeriod = "FINAL";
					break;
				default:
					break;
				}
				getComFeeResult = aa.finance.getFeeItemByFeeCode(capId, companionFeeCode, companionFeePeriod);
				if (getComFeeResult.getSuccess()) {
					comFeeList = getComFeeResult.getOutput();
					if (comFeeList != null && comFeeList.length > 0) {
						companionCheck = true;
						if (feeList == null || feeList.length == 0)
							feeList = comFeeList;
						else {
							for (comIndex in comFeeList)
								feeList.push(comFeeList[comIndex]);
						}
					}
				}
			}

			for (feeNum in feeList) {
				if (feeList[feeNum].getFeeitemStatus().equals("INVOICED")) {
					invFeeItem = feeList[feeNum];
					invFeeObj = loadOneFee(invFeeItem);
					if (pDuplicate == "Y") {
						if (invFeeObj.code == fcode || (companionCheck && invFeeObj.code == companionFeeCode)) {
							removeFee(fcode, fperiod); // remove any NEW fees that might exist
							if (companionCheck)
								removeFee(companionFeeCode, companionFeePeriod);
							currentAmt = feeAmount(fcode, "INVOICED"); // get amount of all fees for this fee code
							currentQty = getFeeQty(fcode);
							if (companionCheck) {
								// get converted amt/qty too
								currentAmt += feeAmount(companionFeeCode, "INVOICED");
								currentQty += getFeeQty(companionFeeCode);
							}
							refFeeDef = getFeeDefByCode(fsched, fcode);
							aa.print(refFeeDef.calcProc);
							switch ("" + refFeeDef.calcProc) {
							case "ICBO_STYLE":
								newAmt = calcICBOFee(refFeeDef.formula, parseFloat(fqty));
								break;
							case "ICBO_STYLE_ENHANCED":
								newAmt = calcICBOEnhancedFee(refFeeDef.formula, parseFloat(fqty));
								break;
							case "FIXED_FEE_BY_RANGE":
								newAmt = calcFixedFeeByRangeFee(refFeeDef.formula, parseFloat(fqty));
								break;
							default:
								logDebug("Unknown calc proc");
								newAmt = 0;
								break;
							}
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
		logDebug("A JavaScript error has occurred in custom function updateFeeWithFormula: " + err.message + "In line number: " + err.lineNumber);
	}
}
