editCapParcelAttribute(pNum, aName, aValue)
 {
	var fcapParcelObj = null;
	var itemCap = capId;
	var capParcelResult = aa.parcel.getParcelandAttribute(itemCap, null);
	if (capParcelResult.getSuccess())
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	else
		logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage())

		for (i in fcapParcelObj) {
			if (fcapParcelObj[i].getParcelNumber().equals(pNum)) {
				parcelObj = fcapParcelObj[i];
				parcelAttrColl = parcelObj.getParcelAttribute();
				parcelAttrArray = parcelAttrColl.toArray();
				var changeMade = false;
				for (paIndex in parcelAttrArray) {
					thisPA = parcelAttrArray[paIndex];
					if (thisPA.getB1AttributeName().equals(aName)) {
						changeMade = true;
						aValue = "" + aValue;
						thisPA.setB1AttributeValue(aValue.substring(0, 200));
					}
				}
				// reload the collection with the array elements
				if (changeMade) {
					parcelAttrColl.clear();
					for (paIndex2 in parcelAttrArray)
						parcelAttrColl.add(parcelAttrArray[paIndex2]);

					logDebug(parcelAttrColl.size());
					parcelObj.setParcelAttribute(parcelAttrColl);
					var capPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(capId, parcelObj);
					if (capPrclObj.getSuccess()) {
						var capPrcl = capPrclObj.getOutput();
						editResult = aa.parcel.updateDailyParcelWithAPOAttribute(capPrcl);
						if (editResult.getSuccess())
							logDebug("Successfully edited parcel");
						else
							logDebug("Error editing parcel " + editResult.getErrorMessage());
					}
				}
			}
		}
}