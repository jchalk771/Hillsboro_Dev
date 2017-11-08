function removeSDCCondition(cName) {
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
		var pcResult = aa.parcelCondition.getParcelConditions(parcelNum);
		if (pcResult.getSuccess()) {
			var parcelConditions = pcResult.getOutput();
			for (pci in parcelConditions) {
				thisParcelCondition = parcelConditions[pci];
				if (thisParcelCondition.getConditionType().equals("Parcel") && thisParcelCondition.getConditionDescription().equals(cName)) {
					shortComments = "" + thisParcelCondition.getConditionComment();
					if (shortComments.equals(capIDString)) {
						var rmParcelCondResult = aa.parcelCondition.removeParcelCondition(thisParcelCondition.getConditionNumber(), parcelNum);
						if (rmParcelCondResult.getSuccess())
							logDebug("Successfully removed condition from Parcel ");
					}
				}
			}
		} else
			logDebug("Error getting parcel conditions " + pcResult.getErrorMessage());
	}
}
