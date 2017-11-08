function updateParksBank() {
	tObj = loadASITable("PARKS SDC INFORMATION");
	unitTotalAdd = sumASITColumn(tObj, "Line Item Unit Total", "INCLUDE", "Type of Change", "Add Unit");
	unitTotalRemove = sumASITColumn(tObj, "Line Item Unit Total", "INCLUDE", "Type of Change", "Remove Unit");
	unitTotal = roundNumber((unitTotalAdd + unitTotalRemove), 2);
	if (unitTotal > 0) {
		addToTLIDBankField("Existing Parks Units", unitTotal);
	}
	if (unitTotal < 0) {
		addToTLIDBankField("Existing Parks Units", unitTotal);
		addToTLIDBankField("Parks Credit Units", -unitTotal);
	}

	creditUnits = roundNumber(sumASITColumn(tObj, "Line Item Unit Total", "INCLUDE", "Type of Change", "Use Unit Credit"), 2);
	if (creditUnits != 0) {
		logDebug("Subtracting " + creditUnits + " to bank field Parks Credit Units");
		addToTLIDBankField("Parks Credit Units", creditUnits);
	}
}
