function updatePlnRvw(FeeCode, FeeSchedule, SubGrp, SGPRFeeCode) {
	var FeeCode;
	var FeeSchedule;
	var SubGrp;
	var SGPRFeeCode;
	logDebug("updatePlnRvw Function: Fee Code: " + FeeCode + "; Fee Schedule: " + FeeSchedule + "; SubGroup: " + SubGrp);
	if (arguments.length == 4) {
		FeeCode = arguments[0]; // Fee code to update
		FeeSchedule = arguments[1]; // Fee Scheulde for Fee Code
		SubGrp = arguments[2]; // Sub Group that surcharge applies to
		SGPRFeeCode = arguments[3]; // Sub Group Plan Review fee code - amount from this feeCode needs to be subtracted from the Sub Group amount.
	} else {
		logDebug("Not enough arguments passed to the function: updatePlnRvw");
	}

	var tmpSubGrpFeeAmtNew = getSubGrpFeeAmt(SubGrp, "NEW", FeeCode);
	var tmpSubGrpFeeAmtInv = getSubGrpFeeAmt(SubGrp, "INVOICED", FeeCode);
	var tmpSubGrpFeeTotal = (tmpSubGrpFeeAmtNew + tmpSubGrpFeeAmtInv);
	var SGPRinvFeeAmt = 0;
	var SGPRnewFeeAmt = 0;
	var SGPRcrdtFeeAmt = 0;
	var invFeeAmt = 0;
	var newFeeAmt = 0;
	var crdtFeeAmt = 0;
	var currPlnRvwFeeAmt = 0;

	// Get any plan review fees for the subgroup
	if (feeExists(SGPRFeeCode, "NEW")) {
		SGPRnewFeeAmt = feeAmount(SGPRFeeCode, "NEW");
		logDebug("Plan Review Fee exists - SGPRnewFeeAmt = " + SGPRnewFeeAmt);
	}
	if (feeExists(SGPRFeeCode, "CREDITED")) {
		SGPRcrdtFeeAmt = feeAmount(SGPRFeeCode, "CREDITED");
		logDebug("Plan Review Fee exists - SGPRcrdtFeeAmt = " + SGPRcrdtFeeAmt);
	}
	if (feeExists(SGPRFeeCode, "INVOICED")) {
		SGPRinvFeeAmt = feeAmount(SGPRFeeCode, "INVOICED");
		logDebug("Plan Review Fee exists - SGPRinvFeeAmt = " + SGPRinvFeeAmt);
	}

	if (FeeCode != SGPRFeeCode) {
		tmpSubGrpFeeTotal = (tmpSubGrpFeeTotal - (SGPRnewFeeAmt + SGPRinvFeeAmt - SGPRcrdtFeeAmt));
	}

	// Get any plan review fees for the plan review fee being checked for updating
	if (feeExists(FeeCode, "NEW")) {
		newFeeAmt = feeAmount(FeeCode, "NEW");
		logDebug("Plan Review Fee exists - newFeeAmt = " + newFeeAmt);
	}
	if (feeExists(FeeCode, "CREDITED")) {
		crdtFeeAmt = feeAmount(FeeCode, "CREDITED");
		logDebug("Plan Review Fee exists - crdtFeeAmt = " + crdtFeeAmt);
	}
	if (feeExists(FeeCode, "INVOICED")) {
		invFeeAmt = feeAmount(FeeCode, "INVOICED");
		logDebug("Plan Review Fee exists - invFeeAmt = " + invFeeAmt);
	}

	// Get the fee formula for the plan review fee you might be updating
	if (feeExists(FeeCode, "INVOICED", "CREDITED")) {
		logDebug("A Plan Review fee exists that is invoiced or credited");
		var feeA = loadFees();
		for (x in feeA) {
			thisFee = feeA[x];
			if (thisFee.code == FeeCode) {
				var feeformula = thisFee.formula;
			}
		}

		currPlnRvwFeeAmt = (invFeeAmt - crdtFeeAmt);
		logDebug("***** currPlnRvwFeeAmt for " + FeeCode + " = " + currPlnRvwFeeAmt);

		logDebug("the Fee Formula = " + feeformula);
		var expectedFee = (tmpSubGrpFeeTotal * feeformula);
		logDebug("***** expectedFee for " + FeeCode + " = " + expectedFee);

		var adjSubGrpAmt = (tmpSubGrpFeeTotal - (currPlnRvwFeeAmt / feeformula));
		logDebug("***** adjSubGrpAmt for " + SubGrp + " = " + adjSubGrpAmt);
		logDebug("***** tmpSubGrpFeeTotal for " + SubGrp + " = " + tmpSubGrpFeeTotal);

		if (expectedFee >= currPlnRvwFeeAmt + 1 && currPlnRvwFeeAmt == 0) {
			logDebug("********* return = " + tmpSubGrpFeeTotal)
			return tmpSubGrpFeeTotal;
		} else if (expectedFee == currPlnRvwFeeAmt) {
			logDebug("********* return = 0")
			return 0;
		} else {
			logDebug("********* return = " + adjSubGrpAmt)
			return adjSubGrpAmt;
		}

	} else {
		logDebug("A Plan Review fee exists that is NEW");
		return tmpSubGrpFeeTotal;
	}
}
