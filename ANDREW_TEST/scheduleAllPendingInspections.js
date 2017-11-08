function scheduleAllPendingInspections() {
	var schedTomorrow = (new Date().getHours() >= 6)

	if (arguments.length == 1) {
		itemCap = arguments[0];
	} else {
		var itemCap = capId;
	}
	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			inspObj = inspList[xx];
			if (inspObj.getInspectionType().indexOf("FINAL") == -1 && inspObj.getDocumentDescription().equals("Insp Pending") && inspObj.getAuditStatus().equals("A")) {
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
