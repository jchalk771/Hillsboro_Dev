applySDCCondition(cName)
 {
	// find the primary parcel on this record
	parcelToUse = null;
	parcelNum = null;
	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
	if (capParcelResult.getSuccess()) {
		var Parcels = capParcelResult.getOutput().toArray();
		for (zz in Parcels) {
			thisParcel = Parcels[zz];
			if (thisParcel.getPrimaryParcelFlag() == "Y") {
				parcelToUse = thisParcel;
				break;
			}
		}
		if (parcelToUse == null && Parcels.length > 0)
			parcelToUse = Parcels[0];
	}
	if (parcelToUse != null) {
		parcelNum = parcelToUse.getParcelNumber();

	}
	if (parcelNum != null) {
		logDebug("Applying condition to parcel " + parcelNum);
		condNumber = null;
		adminUserObj = aa.person.getUser("ADMIN").getOutput();
		var addParcelCondResult = aa.parcelCondition.addParcelCondition(parcelNum, 'Parcel', cName, capIDString, null, null, 'Notice', 'Applied', sysDate, null, sysDate, sysDate, adminUserObj, adminUserObj);
		if (addParcelCondResult.getSuccess()) {
			logDebug("Successfully added condition to Parcel ");
			condNumber = addParcelCondResult.getOutput();
		}
		if (condNumber != null) {
			getConditionResult = aa.parcelCondition.getParcelCondition(parcelNum, condNumber);
			if (getConditionResult.getSuccess()) {
				cond = getConditionResult.getOutput();
				aa.print(cond);
				cond.setConditionGroup("SDCs");
				aa.parcelCondition.editParcelCondition(cond);
			}
		}
	}
}