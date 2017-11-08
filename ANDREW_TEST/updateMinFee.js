updateMinFee(MinFeeAmt, MinFeeSubGrp, FeeCode, FeeSchedule) {
	var MinFeeAmt;
	var MinFeeSubGrp;
	var FeeCode;
	var FeeSchedule;
	logDebug("updateMinFee Function: " + MinFeeAmt + "; " + MinFeeSubGrp + "; " + FeeCode + "; " + FeeSchedule);
	if (arguments.length == 4) {
		MinFeeAmt = arguments[0]; // Min Fee Amount
		MinFeeSubGrp = arguments[1]; // Subgroup of fees that apply against the min fee amount
		FeeCode = arguments[2]; // Fee Code of the actual min fee to be updated
		FeeSchedule = arguments[3]; // Fee Scheulde for min fee, Fee Code
	} else {
		logDebug("Not enought arguments passed to the function: updateMinFee");
	}
	var tmpSubGrpFeeAmt = getSubGrpFeeAmt(MinFeeSubGrp, "", FeeCode);

	//if (tmpSubGrpFeeAmt == 0) {
	//	logDebug("No fee items exist that are a part of the minimum fee requirment.")
	//	}

	var tmpAmtDif = minmax(0, MinFeeAmt - tmpSubGrpFeeAmt, 1);

	//If fees exist that are a part of the minimum fee, and their total is less than the minimum fee amount,
	//try and add the fee
	//if (0 < tmpSubGrpFeeAmt && tmpSubGrpFeeAmt < MinFeeAmt && tmpAmtDif != 0) {
	if (0 < tmpSubGrpFeeAmt && tmpSubGrpFeeAmt < MinFeeAmt && tmpAmtDif != 0) {
		//If minimum fee already exist and the amount is different than the new minimum fee,
		//void or remove it before adding the new qty.
		if (feeExists(FeeCode) && (tmpAmtDif != getFeeQty(FeeCode))) {
			logDebug("Existing fee: " + FeeCode + ", found with quanity: " + getFeeQty(FeeCode) + ". New Quantiy is: " + tmpAmtDif);
			// global fix lec 4/30/14 voidRemoveFees(FeeCode)
			//Add the new fee from ASI quanity.
			updateFee(FeeCode, FeeSchedule, "STANDARD", tmpAmtDif, "N", "Y");
			logDebug("Fee information has been modified.");
		} else if (feeExists(FeeCode) && (tmpAmtDif == getFeeQty(FeeCode))) {
			logDebug("Existing fee found with quanity: " + getFeeQty(FeeCode) + ". New Quantiy is: " + tmpAmtDif + ". No changes are being made to fee.");
		}

		//No existing fee is found, add the new fee
		if (feeExists(FeeCode) != true) {
			updateFee(FeeCode, FeeSchedule, "STANDARD", tmpAmtDif, "N", "Y");
			logDebug("Fee information has been modified.");
		}
	}
	//No fee items exist that are a part of the minimum fee requirment. Check to see if a min fee has already been applied. If so, void or remove it.
	else {
		logDebug("No fee items exist that are a part of the minimum fee requirment. Minimum fee does not apply.")
		//Check to see if a fee for the ASI item exists. No fee should be present, but check anyways.
		if (feeExists(FeeCode) && tmpSubGrpFeeAmt >= 0) {
			//Fee is found and should be voided or removed.
			// global fee fix lec 4/30/14 voidRemoveFees(FeeCode)
			reduceFeeAmtToZero(FeeCode, FeeSchedule, "STANDARD");
		}
	}
}
