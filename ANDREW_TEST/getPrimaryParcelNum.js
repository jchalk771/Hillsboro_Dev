getPrimaryParcelNum()
 {
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
	return parcelNum;
}