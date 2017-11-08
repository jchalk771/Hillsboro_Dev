getSchoolFeeConstants(Period, schoolDistrictNumber, useType)
 {
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