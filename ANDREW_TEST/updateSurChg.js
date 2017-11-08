updateSurChg(FeeCode, FeeSchedule, SubGrp)
 {
	var FeeCode;
	var FeeSchedule;
	var SubGrp;
	logDebug("updateSurChg Function: Fee Code: " + FeeCode + "; Fee Schedule: " + FeeSchedule + "; SubGroup: " + SubGrp);
	if (arguments.length == 3) {
		FeeCode = arguments[0]; // Fee code to update
		FeeSchedule = arguments[1]; // Fee Scheulde for Fee Code
		SubGrp = arguments[2]; // Sub Groupthat surcharge applies to
	} else {
		logDebug("Not enought arguments passed to the function: updateSurChg");
	}

	var tmpSubGrpFeeAmtNew = getSubGrpFeeAmt(SubGrp, "NEW", FeeCode);
	var tmpSubGrpFeeAmtInv = getSubGrpFeeAmt(SubGrp, "INVOICED", FeeCode);

	//If new fees exist that are a part of the surcharge then try and add the fee
	if (tmpSubGrpFeeAmtNew > 0) {
		//If fee already exist, void or remove it before adding the new qty.
		if (feeExists(FeeCode)) {
			voidRemoveFees(FeeCode)
		}
		//Add the new sur charge fee.
		updateFee(FeeCode, FeeSchedule, "STANDARD", 1, "N", "Y");
		logDebug("Fee information has been modified.");
	}
	//No new fee items exist that are a part of the surcharge fee.
	//If any invoiced fees exist that require the surcharge don't remove the fee.
	else if (tmpSubGrpFeeAmtInv == 0 && tmpSubGrpFeeAmtNew == 0) {
		logDebug("No fee items exist that are a part of the surcharge fee requirment. Surcharge does not apply.")
		//Check to see if a fee for the ASI item exists. No fee should be present, but check anyways.
		if (feeExists(FeeCode)) {
			//Fee is found and should be voided or removed.
			voidRemoveFees(FeeCode)
		}

	} else {
		logDebug("No new fee items exist that are a part of the surcharge fee requirment. No changes are being made.")
	}
}