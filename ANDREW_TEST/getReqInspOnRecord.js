function getReqInspOnRecord() {

	var retValue = "";
	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		if (inspList != null) {
			for (xx in inspList) {
				var thisInsp = inspList[xx];
				thisInspType = thisInsp.getInspectionType();
				inspModel = thisInsp.getInspection();
				if (inspModel != null) {
					activityModel = inspModel.getActivity();
					if (activityModel.getRequiredInspection() == "Y") {
						if (retValue != "")
							retValue += ",";
						retValue += thisInspType;
					}
				}
			}
		}
	}
	return retValue;
}
