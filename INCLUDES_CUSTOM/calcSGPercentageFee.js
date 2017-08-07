function calcSGPercentageFee(calcVariable, SubGrp, FeeCode) {
	try {
		
		perc = parseFloat(calcVariable);
		if (perc == 0)
			return 1;
		else {
			var tmpSubGrpFeeAmtInv = getSubGrpFeeAmt(SubGrp, "INVOICED", FeeCode);
			var tmpSubGrpFeeAmtNew = getSubGrpFeeAmt(SubGrp, "NEW", FeeCode);
			// RM added rounding to this line per DH instructions see below - return (tmpSubGrpFeeAmtInv + tmpSubGrpFeeAmtNew) * (perc/100);
			return roundNumber((tmpSubGrpFeeAmtInv + tmpSubGrpFeeAmtNew) * (perc / 100), 2);
		}

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function calcSGPercentageFee: " + err.message + "In line number: " + err.lineNumber);
	}
}