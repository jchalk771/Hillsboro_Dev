updateASSURANCESasit(wfDate)
 {
	tObj = loadASITable("ASSURANCES");
	newTable = new Array();
	var reloadTable = false;
	for (row in tObj) {
		reloadTable = true;
		thisRow = tObj[row];
		if (thisRow["Start"].fieldValue == null || thisRow["Start"].fieldValue == "") {
			thisRow["Start"].fieldValue = wfDate;
		}
		newTable.push(thisRow);
	}
	if (reloadTable) {
		removeASITable("ASSURANCES");
		addASITable("ASSURANCES", newTable);
	}
}