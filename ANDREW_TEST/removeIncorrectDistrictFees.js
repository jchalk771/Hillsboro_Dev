removeIncorrectDistrictFees(schoolDistrict)
 {

	logDebug("schoolDistrict into removeIncorrectDistricFees is: " + schoolDistrict);

	if (schoolDistrict.toUpperCase() == "HILLSBORO") {
		if (feeExists(lookup("School_Fee_Code_Lookup", "BeavCityCombined")))
			reduceFeeAmtToZero(lookup

				("School_Fee_Code_Lookup", "BeavCityCombined"), "B_STR", "STANDARD");
		if (feeExists(lookup("School_Fee_Code_Lookup", "BeavSchCombined")))
			reduceFeeAmtToZero(lookup

				("School_Fee_Code_Lookup", "BeavSchCombined"), "B_STR", "STANDARD");
		if (feeExists(lookup("School_Fee_Code_Lookup", "BeavCityWaiver")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "BeavCityWaiver"), "B_STR", "CETBEAV");
		if (feeExists(lookup("School_Fee_Code_Lookup", "BeavSchWaiver")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "BeavSchWaiver"), "B_STR", "CETBEAVSCH");
	} else if (schoolDistrict.toUpperCase() == "BEAVERTON") {
		if (feeExists(lookup("School_Fee_Code_Lookup", "HillsCityCombined")))
			reduceFeeAmtToZero(lookup

				("School_Fee_Code_Lookup", "HillsCityCombined"), "B_STR", "STANDARD");
		if (feeExists(lookup("School_Fee_Code_Lookup", "HillsSchCombined")))
			reduceFeeAmtToZero(lookup

				("School_Fee_Code_Lookup", "HillsSchCombined"), "B_STR", "STANDARD");
		if (feeExists(lookup("School_Fee_Code_Lookup", "HillsCityWaiver")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "HillsCityWaiver"), "B_STR", "CETHILL");
		if (feeExists(lookup("School_Fee_Code_Lookup", "HillsSchWaiver")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "HillsSchWaiver"), "B_STR", "CETHILLSCH");
	} else {
		removeSchoolCETFees();
	}
}