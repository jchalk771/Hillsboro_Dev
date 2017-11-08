function scheduleReqInspections() {
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			if (/*inspList[xx].getRequiredInspection().equals("Y") &&*/ inspList[xx].getInspectionStatus().equals("Pending")) //&& inspList[xx].getRequiredInspection().equals("Y"))
			{
				scheduleInspection(inspList[xx].getInspectionType(), 180, null, null, "Auto-Scheduled because the FINAL inspection was scheduled");
			}
		}
		return "Success";
	} else {
		logDebug("***** Could not get insp List [scheduleReqInspection()] ****");
	}

}
