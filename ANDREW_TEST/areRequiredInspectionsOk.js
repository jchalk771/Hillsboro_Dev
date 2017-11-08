areRequiredInspectionsOk(thisInspType)
 {

	var approvedStatuses = new Array();
	var retValue = false;

	for (var i = 1; i < arguments.length; i++) {
		approvedStatuses.push(arguments[i]);
	}
	var reqInspTypeList = getReqInspOnRecord();
	if (reqInspTypeList == null || reqInspTypeList.length == 0)
		return true;
	reqInspTypeArray = reqInspTypeList.split(",");
	reqInspTypeList = new Array();
	for (jj in reqInspTypeArray) { // remove any duplicates
		if (!exists(reqInspTypeArray[jj], reqInspTypeList))
			reqInspTypeList.push(reqInspTypeArray[jj]);
	}

	var inspResultObj = aa.inspection.getInspections(capId);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
	} else {
		logDebug("Error getting inspections on record " + inspResultObj.getErrorMessage());
	}
	if (reqInspTypeList != null && reqInspTypeList.length > 0 && inspList != null && inspList.length > 0) {
		retValue = true;
		for (yy in reqInspTypeList) {
			var thisReqType = reqInspTypeList[yy];
			logDebug("This required inspection type: " + thisReqType);
			if (thisReqType != "" && thisReqType != thisInspType) {
				var thisReqTypeOk = false;
				for (var xx in inspList) {
					var thisInsp = inspList[xx];
					if (String(thisInsp.getInspectionType()).equals(String(thisReqType))) {
						inspResult = String(thisInsp.getInspectionStatus());
						thisInspStatusDate = thisInsp.getInspectionStatusDate();
						if (exists(inspResult, approvedStatuses)) {
							thisReqTypeOk = true;
						} else {
							// check to see if there is another inspection of the same type with a newer or equal date
							for (var zz in inspList) {
								var tInsp = inspList[zz];
								if (String(tInsp.getInspectionType()).equals(String(thisReqType))) {
									tResult = String(tInsp.getInspectionStatus());
									if (exists(tResult, approvedStatuses)) {
										if (tInsp.getInspectionStatusDate() >= thisInspStatusDate) {
											thisReqTypeOk = true;
										}
									}
								}
							}
						}
					}
				}
				if (!thisReqTypeOk)
					retValue = false;
			}
		}
	}
	return retValue;
}