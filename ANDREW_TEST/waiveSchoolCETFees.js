function waiveSchoolCETFees(schoolDistrict) {

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

/*
 * Custom Function removeIncorrectDistrictFees
 * To be called after each fee update to ensure that if the district changes, irrelevant fees are removed.
 * Call in place of branch within existing event script lines
 * Developed for City of Hillsboro
 * 6.10.16 - J Chalk
 */