doesScheduledInspectionExist(iType)
 {
	var itemCap = capId;
	if (arguments.length == 3) {
		itemCap = arguments[2];
	} // use cap ID specified in args

	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			if (inspList[xx].getInspectionType().equals(iType) && inspList[xx].getInspectionStatus().equals("Scheduled")) {
				return true;
			}
		}
	}
	return false;
}