function doesASITRowExist(tName, cName, cValue) {

	tempASIT = loadASITable(tName);
	if (tempASIT == undefined || tempASIT == null)
		return false;
	var rowFound = false;
	for (var ea in tempASIT) {
		var row = tempASIT[ea];
		fv = "" + row[cName].fieldValue;
		cValue = "" + cValue;
		r = new RegExp("^" + cValue + "(.)*");

		if ((String(fv).match(r)) || (fv == cValue)) {
			return true;

		}
	}
	return rowFound;
}
