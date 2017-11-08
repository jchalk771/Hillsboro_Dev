function getSchoolFeeConstants(Period, schoolDistrictNumber, useType) {
	var calcFactor = "";
	calcFactor = (Period.toString() + schoolDistrictNumber.toString() + useType.toString());
	logDebug("calcFactor code is: " + calcFactor);

	var constArray = new Array();
	constArray = lookup("School_Fee_Constant_Lookup", calcFactor).split("|"); //lookup returns a string


	logDebug("constArray[cap]is: " + constArray[0]);
	logDebug("constArray[rate]is: " + constArray[1]);

	calcCap = parseFloat(constArray[0]);
	calcRate = parseFloat(constArray[1]);

	return {
		rate : calcRate,
		cap : calcCap
	}; //sending back calRate and calcCap in a JSON Array
}

/**Custom Function adjustSchoolCETFees
 * called and used as criteria within the event calls to add, remove, update school CET fees
 * designed to exclude records within a specific status from being automatically adjusted past various points in the record life cycle.
 * also eliminates automatic calculation for records applied for prior to the earliest threshold date.
 * @param appliedDate string
 * @param recordStatus string
 * @returns {Boolean}
 */