function updateReinstatement(FeeCode, FeeSchedule, SubGrp) {
	var FeeCode;
	var FeeSchedule;
	var SubGrp;
	var SGPRFeeCode;
	logDebug("updateReinstatement Function: Fee Code: " + FeeCode + "; Fee Schedule: " + FeeSchedule + "; SubGroup: " + SubGrp);
	if (arguments.length == 3) {
		FeeCode = arguments[0]; // Fee code to update
		FeeSchedule = arguments[1]; // Fee Scheulde for Fee Code
		SubGrp = arguments[2]; // Sub Group that surcharge applies to
	} else {
		logDebug("Not enough arguments passed to the function: updateReinstatement");
	}

	var tmpSubGrpFeeAmtNew = getSubGrpFeeAmt(SubGrp, "NEW", FeeCode);
	var tmpSubGrpFeeAmtInv = getSubGrpFeeAmt(SubGrp, "INVOICED", FeeCode);
	var tmpSubGrpFeeTotal = (tmpSubGrpFeeAmtNew + tmpSubGrpFeeAmtInv);

	var feeA = getFeeDefByCode(FeeSchedule, FeeCode);
	logDebug("the Fee Formula = " + feeA.formula);
	var feeformula = parseFloat(feeA.formula);
	if (feeformula > 1)
		feeformula = feeformula / 100;
	var expectedFee = (tmpSubGrpFeeTotal * feeformula);
	logDebug("***** expectedFee for " + FeeCode + " = " + expectedFee);

	updateSGFee(FeeCode, FeeSchedule, "MECH");
	updateFee("SURCHGREINST", "SURCHRG", "STANDARD", expectedFee, "N", "Y");
}
