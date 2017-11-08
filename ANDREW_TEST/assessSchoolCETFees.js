assessSchoolCETFees(schoolDistrict, appDate, resSqFt, comSqFt)
 {

	//Debug Logging
	logDebug("Begin assessSchoolCETFees:  District = " + schoolDistrict + " Opened Date = " + appDate);
	logDebug("Residential Sq Footage = " + resSqFt);
	logDebug("Commercial Sq Footage = " + comSqFt);
	logDebug("Applied Date = " + appDate);

	//Check for Nulls
	if (resSqFt == null || resSqFt == "")
		resSqFt = 0;
	if (comSqFt == null || comSqFt == "")
		comSqFt = 0;

	//Variable Declarations
	var schoolDistrictNumber;
	var period;
	var resRate = 0;
	var comRate = 0;
	var resCap = 0;
	var comCap = 0;
	var pAppliedDate = convertDate(appDate);
	//logDebug("Applied Date is: " + appliedDate);
	//var pAppliedDate = appliedDate.getTime();
	logDebug("pAppliedDate is: " + pAppliedDate);
	var cityFeeCode = null;
	var schoolsFeeCode = null;
	var resFeePortion = 0;
	var comFeePortion = 0;

	//Effective Period Code Lookup
	period = getSchoolFeePeriod(pAppliedDate);

	//School District Code
	if (schoolDistrict.toUpperCase() == "HILLSBORO")
		schoolDistrictNumber = 1;
	if (schoolDistrict.toUpperCase() == "BEAVERTON")
		schoolDistrictNumber = 2;

	//Fetch the appropriate fee codes
	if (schoolDistrictNumber == 1) {
		cityFeeCode = lookup("School_Fee_Code_Lookup", "HillsCityCombined");
		schoolsFeeCode = lookup("School_Fee_Code_Lookup", "HillsSchCombined");
	}

	if (schoolDistrictNumber == 2) {
		cityFeeCode = lookup("School_Fee_Code_Lookup", "BeavCityCombined");
		schoolsFeeCode = lookup("School_Fee_Code_Lookup", "BeavSchCombined");
	}

	// Calculation methodology
	var calcs;
	var useType = 0;

	//do this for each because of mixed use buildings

	if (resSqFt > 0) {
		//Residential
		useType = 1;
		calcs = getSchoolFeeConstants(period, schoolDistrictNumber, useType);

		//calculate Residential Fee
		resFeePortion = resSqFt * parseFloat(calcs.rate);

		logDebug("Original Assessed Residential Fee Portion is: " + resFeePortion);

		//resFeePortion = (resFeePortion > calcs.cap) ? calcs.cap:resFeePortion;
		//

	}

	if (comSqFt > 0) {
		//Commercial
		useType = 2;
		calcs = getSchoolFeeConstants(period, schoolDistrictNumber, useType);

		//calculate Commercial Fee
		comFeePortion = comSqFt * calcs.rate;
		logDebug("Original Assessed Commercial Fee Portion is: " + comFeePortion);

		comFeePortion = (comFeePortion > calcs.cap) ? calcs.cap : comFeePortion;

	}

	var combinedSchoolFee = resFeePortion + comFeePortion;
	logDebug("Combined Fee is: " + combinedSchoolFee);

	var cityFeeQtyRough = combinedSchoolFee * 0.04;
	var cityFeeQty = (Math.round(cityFeeQtyRough * 100) / 100).toFixed(2);
	var schoolsFeeQtyRough = combinedSchoolFee * 0.96;
	var schoolsFeeQty = (Math.round(schoolsFeeQtyRough * 100) / 100).toFixed(2);

	logDebug("City: " + cityFeeQty + " and Schools: " + schoolsFeeQty);

	updateFee(cityFeeCode, "B_STR", "STANDARD", cityFeeQty, "N");
	updateFee(schoolsFeeCode, "B_STR", "STANDARD", schoolsFeeQty, "N");

}