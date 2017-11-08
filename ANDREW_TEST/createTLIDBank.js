createTLIDBank()
 {

	TLID = getPrimaryParcelNum();
	if (TLID == null) {
		logDebug("No parcel on record");
		return;
	}
	tlidResult = aa.cap.getCapID(TLID);
	if (tlidResult.getSuccess()) {
		tlidCapId = tlidResult.getOutput();
		if (tlidCapId != null) {
			logDebug("TLID record already exists");
			return tlidCapId;
		}
	}
	tlidCapId = createCap("Building/SDC Bank/NA/NA", null);
	createResult = aa.cap.updateCapAltID(tlidCapId, TLID)
		if (createResult.getSuccess())
			logDebug("Successfully modified altID of TLID record");
		else
			logDebug("Error modifying altID of TLID record");

		// copy the parcel
		var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess()) {
		var Parcels = capParcelResult.getOutput().toArray();
		for (zz in Parcels) {
			if ("" + Parcels[zz].getParcelNumber() == TLID) {
				var newCapParcel = aa.parcel.getCapParcelModel().getOutput();
				newCapParcel.setParcelModel(Parcels[zz]);
				newCapParcel.setCapIDModel(tlidCapId);
				newCapParcel.setL1ParcelNo(Parcels[zz].getParcelNumber());
				newCapParcel.setParcelNo(Parcels[zz].getParcelNumber());
				pResult = aa.parcel.createCapParcel(newCapParcel);
				if (pResult.getSuccess())
					logDebug("Copied parcel to bank record");
				break;
			}
		}
	}
}