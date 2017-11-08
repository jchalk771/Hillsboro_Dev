schoolCETBranchUpdates()
 {

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