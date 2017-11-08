doesASITableExistAndHaveSomeValue(tName)
 {
	tempASIT = loadASITable(tName);
	if (tempASIT == undefined || tempASIT == null)
		return false;
	for (var ea in tempASIT) {
		var row = tempASIT[ea];
		for (var col in row) {
			fv = "" + row[col].fieldValue;
			if (fv != undefined && fv != null && fv != "") {
				return true;
			}
		}
	}
	return false;
}