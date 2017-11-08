function schoolCETBranchUpdates() {

	var schoolDistrict = AInfo["School District"];
	var resSqFt = AInfo["Residential Living Area SqFt"];
	var comSqFt = AInfo["Non Residential SqFt"];
	var sCETRefused = AInfo["School CET Refused"];
	var sCETExempt = AInfo["School CET Exempt"];

	assessSchoolCETFees(schoolDistrict, fileDateObj, resSqFt, comSqFt);

	if (comSqFt == 0 && resSqFt == 0)
		removeSchoolCETFees();

	removeIncorrectDistrictFees(schoolDistrict);

	if (sCETRefused == "Yes" || sCETExempt == "Yes")
		waiveSchoolCETFees(schoolDistrict);

}

/* Custom Function getSchoolFeePeriod called by assessSchoolCETFees custom function
 * Determines the period values in the school rate period code
 * developed from logic by R Samuel, designed for City of Hillsboro
 * adapted for Accela Civic Platform jchalk 6.10.16
 */