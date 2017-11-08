function closeAllViolationTables() {

	closeViolationTable(capId); // close on current CAP
	var pArr = getParents("Enforcement/*/*/*");
	if (pArr == undefined || pArr == null || pArr.length == 0)
		return;
	for (var eachP in pArr) {
		var thisPId = pArr[eachP];
		if (appMatch("Enforcement/Compliance/*/*", thisPId) || appMatch("Enforcement/Complaint/*/*", thisPId)) {
			capId = thisPId;
			closeAllViolationTables();
		}
	}

}
