function getDuplicateComplaint(lookAheadDays) {

	vioTypeToLookFor = "" + AInfo["Violation Type"];
	vioSubTypeToLookFor = "" + AInfo["Violation Subtype"];
	dateToLookAt = dateAdd(null, lookAheadDays);
	JSDateToLookAt = new Date(dateToLookAt)
		dupArr = getRelatedCapsByAddress(appTypeString);
	if (dupArr == undefined || dupArr == null || dupArr.length == 0)
		return "";
	else {
		for (dIndex in dupArr) { // loop thru all records at the same address and record type
			possDupId = dupArr[dIndex];
			logDebug("Possible duplicate : " + possDupId.getCustomID());
			possDupId = possDupId.getCapID();
			PDcapResult = aa.cap.getCap(possDupId);
			if (PDcapResult.getSuccess()) {
				PDCap = PDcapResult.getOutput();
				if (PDCap != null) {
					PDfileDateObj = PDCap.getFileDate();
					PDfileDate = dateFormatted(PDfileDateObj.getMonth(), PDfileDateObj.getDayOfMonth(), PDfileDateObj.getYear());
					PDfileDateJS = new Date(PDfileDate);
					if (PDfileDateJS >= JSDateToLookAt) {
						vioType = getAppSpecific("Violation Type", possDupId);
						vioSubType = getAppSpecific("Violation Subtype", possDupId);
						if (vioType == vioTypeToLookFor && vioSubType == vioSubTypeToLookFor) {
							PDStatus = PDCap.getCapStatus();
							return possDupId.getCustomID();
							//if (PDStatus == "Open") {
							//return true;
							//}
						} else {
							logDebug("Violation types do not match");
						}
					} else {
						logDebug("Possible duplicate is too old");
					}
				}
			} else {
				logDebug("Error getting cap object " + PDCapResult.getErrorMessage());
			}
		}
	}
	return "";
}
