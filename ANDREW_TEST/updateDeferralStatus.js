updateDeferralStatus()
 {

	tables = ["LARGE PROJ DEFERRED SUBMITTAL", "PLAN REVIEW DEFERRED SUBMITTAL"];
	for (eachTable in tables) {
		tName = tables[eachTable];
		tObj = loadASITable(tName);
		if (tObj == undefined || tObj == null || tObj.length == 0)
			continue;
		changeMade = false;
		newTable = new Array();
		for (eachRow in tObj) {
			thisRow = tObj[eachRow];
			if (thisRow["Deferral Payment Status"].fieldValue == "Invoiced" || thisRow["Deferral Payment Status"].fieldValue == "Invoice") {
				thisRow["Deferral Payment Status"].fieldValue = "Complete";
				changeMade = true;
			}
			newTable.push(thisRow);
		}
		if (changeMade) {
			removeASITable(tName);
			addASITable(tName, newTable);
		}
	}
}