function calcSGPercentageFee(calcVariable, SubGrp, FeeCode) {
	perc = parseFloat(calcVariable);
	if (perc == 0)
		return 1;
	else {
		var tmpSubGrpFeeAmtInv = getSubGrpFeeAmt(SubGrp, "INVOICED", FeeCode);
		var tmpSubGrpFeeAmtNew = getSubGrpFeeAmt(SubGrp, "NEW", FeeCode);
		// RM added rounding to this line per DH instructions see below - return (tmpSubGrpFeeAmtInv + tmpSubGrpFeeAmtNew) * (perc/100);
		return roundNumber((tmpSubGrpFeeAmtInv + tmpSubGrpFeeAmtNew) * (perc / 100), 2);

	}
}

/**************** This begins the new School CET Functions**********************************/

/* Custom Function to assess/update School CET Fees
 * Called from ASA, ASIUA, WTUA
 * Designed for use with Building/Commercial/Structural Permits/NA, Building/Residential/Structural Permits/NA
 * Building/Residential/Combo/NA
 * calls getSchoolFeePeriod, getSchoolFeeConstants
 * developed from logic by R Samuel and Accela, designed for City of Hillsboro
 * consolidated function developed for Civic Platform by jchalk 6.10.16
 */