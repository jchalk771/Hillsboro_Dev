function reduceFeeAmtToZero(fcode, fsched, fperiod) {
	try {
		var feeList = null;
		var invFeeItem = null;
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
		companionCheck = false;
		companionFeeCode = null;
		companionFeePeriod = "STANDARD";
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
		}

		removeFee(fcode, fperiod); // remove any NEW fees that might exist
		if (companionCheck)
			removeFee(companionFeeCode, companionFeePeriod);

		getFeeResult = aa.finance.getFeeItemByFeeCode(capId, fcode, fperiod);
		if (getFeeResult.getSuccess()) {
			feeList = getFeeResult.getOutput();
			invFeeItem = feeList[0];
		}

		currentAmt = feeAmount(fcode, "INVOICED"); // get amount of all fees for this fee code
		currentQty = getFeeQty(fcode);
		if (companionCheck) {
			// get converted amt/qty too
			currentAmt += feeAmount(companionFeeCode, "INVOICED");
			currentQty += getFeeQty(companionFeeCode);
		}
		newAmt = 0;
		fqty = 0;
		logDebug("Current amt = " + currentAmt + " current qty = " + currentQty + " new amt = " + newAmt + " new qty = " + fqty);
		diffAmt = newAmt - currentAmt;
		diffQty = fqty - currentQty;
		logDebug("Difference in amt = " + diffAmt + " difference in qty = " + diffQty);
		// need to add a new fee using amount difference.
		if (diffAmt != 0) {
			invFeeItem.setFeeCod(fcode);
			//invFeeItem.setFeeCalcProc("FEE_MULTIPLIER");
			//invFeeItem.setFormula("1");
			invFeeItem.setFeeitemStatus("NEW");
			//invFeeItem.setFeeUnit(diffAmt);
			invFeeItem.setFeeUnit(diffQty);
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
		}
		return; // done
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function reduceFeeAmtToZero: " + err.message + "In line number: " + err.lineNumber);
	}
}
