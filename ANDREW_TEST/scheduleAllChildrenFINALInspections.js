function scheduleAllChildrenFINALInspections() {
	var schedTomorrow = (new Date().getHours() >= 6)

	/*if ( arguments.length == 1 ){
	itemCap = arguments[0];
	} else {
	var itemCap = capId;
	}*/

	var findChildren = aa.cap.getChildByMasterID(capId);
	if (!findChildren.getSuccess()) {
		logDebug("**WARNING: getChildren returned an error: " + findChildren.getErrorMessage());
		return null
	}

	var children = findChildren.getOutput();
	if (!children.length) {
		logDebug("TODO schedule child FINAL insp");
		return false;
	}

	for (child in children) {

		var inspResultObj = aa.inspection.getInspections(children[child].getCapID());
		if (inspResultObj.getSuccess()) {
			var inspList = inspResultObj.getOutput();
			for (xx in inspList) {
				inspObj = inspList[xx];
				if (inspObj.getInspectionType().indexOf("FINAL") > -1 && inspObj.getAuditStatus().equals("A") && inspObj.getDocumentDescription().equals("Insp Pending")) {
					inspModel = inspObj.getInspection();
					actModel = inspModel.getActivity();
					if (actModel.getRequiredInspection().equals("Y")) {
						daysAhead = lookup("ScheduleInspDaysAhead", inspObj.getInspectionType().trim())
							var nDays = 0;
						if (daysAhead != null && daysAhead != "undefined") {
							nDays = parseInt(daysAhead, 10);
						} else {
							if (schedTomorrow)
								nDays++;
						}
						newDate = dateAdd(null, nDays);
						newAADate = aa.util.parseDate(newDate);
						actModel.setActivityDate(newAADate);

						inspModel.setActivity(actModel);
						systemUserObj = aa.person.getUser("ADMIN").getOutput();
						aa.inspection.scheduleInspection(inspModel, systemUserObj);
					}
				}
			}
		}
	}
}
