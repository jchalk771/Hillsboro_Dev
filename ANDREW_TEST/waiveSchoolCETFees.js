waiveSchoolCETFees(schoolDistrict)
 {

	if (schoolDistrict == "HILLSBORO" || schoolDistrict == "Hillsboro") {
		if (feeExists(lookup("School_Fee_Code_Lookup", "HillsCityCombined")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "HillsCityWaiver"), "B_STR", "CETHILL");
		if (feeExists(lookup("School_Fee_Code_Lookup", "HillsSchCombined")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "HillsSchWaiver"), "B_STR", "CETHILLSCH");
	}

	if (schoolDistrict == "BEAVERTON" || schoolDistrict == "Beaverton") {
		if (feeExists(lookup("School_Fee_Code_Lookup", "BeavCityCombined")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "BeavCityWaiver"), "B_STR", "CETBEAV");
		if (feeExists(lookup("School_Fee_Code_Lookup", "BeavSchCombined")))
			updateSGFee(lookup

				("School_Fee_Code_Lookup", "BeavSchWaiver"), "B_STR", "CETBEAVSCH");
	}

}