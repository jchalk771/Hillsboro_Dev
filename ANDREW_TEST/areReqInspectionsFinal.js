function areReqInspectionsFinal() {

	var itemCap = capId;
	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		for (xx in inspList) {
			currStatus = inspList[xx].getInspectionStatus();
			if (inspList[xx].getInspectionType().toString().indexOf("FINAL") == -1 && inspList[xx].getInspection().getActivity().getRequiredInspection().equals("Y") && !(currStatus.indexOf("APPROVED") != -1 || currStatus.indexOf("N/A") != -1)) {
				var inspWasCanceled = false;
				for (yy in inspList) {

					if (!inspWasCanceled && inspList[xx].getInspectionType().toString().equals(inspList[yy].getInspectionType().toString()) && inspList[yy].getInspection().getActivity().getRequiredInspection().equals("Y") && (inspList[yy].getInspectionStatus().indexOf("APPROVED") != -1 || inspList[yy].getInspectionStatus().indexOf("N/A") != -1) && inspList[yy].getInspectionStatusDate() > inspList[xx].getInspectionStatusDate()) {
						inspWasCanceled = true;
					}
				}
				if (!inspWasCanceled) {
					return false
				}
			}
		}
		return true;
	} else {
		logDubug("***** could not get insp List [areReqInspectionsFinal()] ****");
	}
	return false;
}

/*****************