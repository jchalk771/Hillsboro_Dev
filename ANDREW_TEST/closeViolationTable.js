function closeViolationTable(itemCap) {

	logDebug("Closing violations on : " + itemCap.getCustomID());
	tName = "VIOLATIONS";
	vTable = loadASITable(tName, itemCap);
	if (vTable == undefined || vTable == null || vTable.length == 0)
		return;
	var newTable = new Array();
	for (var eachRow in vTable) {
		vioRow = vTable[eachRow];
		// column is "Status" on Complaint, Compliance, Citation : is "Violation Status" on Abatement
		if (appMatch("Enforcement/Abatement/*/*", itemCap))
			vioRow["Violation Status"].fieldValue = "Administrative Closure";
		else
			vioRow["Status"].fieldValue = "Administrative Closure";
		newTable.push(vioRow);
	}
	removeASITable(tName, itemCap);
	addASITable(tName, newTable, itemCap);
}
