calcSpecialBuildingFee()
 {

	specBuildingFee = AInfo["Special Building Fee"];
	buildValAmt = AInfo["Building Valuation Amount"];
	mechValAmt = AInfo["Mechanical Valuation Amount"];
	specFeeAmt = 0;

	addSpecFee = false;
	if (specBuildingFee == "Yes" && buildValAmt != undefined && buildValAmt != null && parseFloat(buildValAmt) >= 0 && mechValAmt != undefined && mechValAmt != null && parseFloat(mechValAmt) >= 0)
		addSpecFee = true;

	if (!addSpecFee) {
		if (feeExists("B_SPEC_005"))
			//voidRemoveFees("B_SPEC_005");
			reduceFeeAmtToZero("B_SPEC_005", "B_STR_SPEC", "STANDARD"); // gff 4-30

		return;
	}
	buildValFee = 0;
	bValuationFeeDef = getFeeDefByCode("B_STR", "B_STR_006");
	if (bValuationFeeDef != null) {
		if (bValuationFeeDef.calcProc == "ICBO_STYLE") {
			buildValFee = calcICBOFee(bValuationFeeDef.formula, parseFloat(buildValAmt));
			logDebug("Building valuation fee is = " + buildValFee);
		}
	}
	planRevFee = buildValFee * 0.65;
	flsFee = buildValFee * 0.40;
	specFeeAmt = buildValFee + planRevFee + flsFee;
	logDebug("Spec Fee Amt based on Building valuation is " + specFeeAmt);

	mechValFee = 0;
	mValuationFeeDef = getFeeDefByCode("B_MECH", "B_MECH_031");
	if (mValuationFeeDef != null) {
		if (bValuationFeeDef.calcProc == "ICBO_STYLE") {
			mechValFee = calcICBOFee(mValuationFeeDef.formula, parseFloat(mechValAmt));
			logDebug("Mechanical valuation fee is = " + mechValFee);
		}
	}
	planRevFee = mechValFee * 0.25;
	specFeeAmt += mechValFee + planRevFee;
	specFeeAmt *= 0.01;
	if (specFeeAmt == 0) {
		if (feeExists("B_SPEC_005", "INVOICED")) {
			//voidRemovefees("B_SPEC_005");
			reduceFeeAmtToZero("B_SPEC_005", "B_STR_SPEC", "STANDARD"); // gff 4-30
		}
	} else {
		newQty = roundNumber(specFeeAmt, 2);
		//if (feeExists("B_SPEC_005", "INVOICED")) {
		//	if (getFeeQty("B_SPEC_005") != roundNumber(specFeeAmt, 2))
		//		voidRemoveFees("B_SPEC_005");
		//}
		updateFee("B_SPEC_005", "B_STR_SPEC", "STANDARD", newQty, "N");
	}
}