getRequiredInspTypeList()
 {

	var itemCap = capId;

	if (arguments.length == 1)
		itemCap = arguments[0];

	var retArray = new Array();
	var inspTypeListResult = aa.inspection.getInspectionListForSchedule(itemCap.getID1(), itemCap.getID2(), itemCap.getID3());

	if (inspTypeListResult.getSuccess()) {
		var inspTypeList = inspTypeListResult.getOutput();
		if (inspTypeList == null)
			return retArray;
		for (var i in inspTypeList) {
			var thisInspType = inspTypeList[i];

			if (thisInspType.getRequiredInspection().equals("Y")) {
				logDebug(thisInspType.getDispType() + " is required");
				retArray.push(thisInspType.getDispType());
			}
		}
	} else {
		logDebug("Error getting inspection list " + inspTypeListResult.getErrorMessage());
	}
	return retArray;
}