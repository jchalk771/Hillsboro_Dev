populateCreditField(asiField, bankField)
 {

	TLID = AInfo["ParcelAttribute.TLNO"];
	if (TLID == undefined || TLID == null || TLID == "") {
		logDebug("No tax lot value for the parcel on this record");
		return;
	}
	tlidResult = aa.cap.getCapID(TLID);
	if (tlidResult.getSuccess()) {
		tlidCapId = tlidResult.getOutput();
		if (tlidCapId != null) {
			bankValue = getAppSpecific(bankField, tlidCapId);
			if (bankValue != undefined && bankValue != null && bankValue != "")
				editAppSpecific(asiField, bankValue);
			else
				logDebug("Bank has no value for " + bankField);
		} else {
			logDebug("No bank record for this TLID : " + TLID);
		}
	}

}