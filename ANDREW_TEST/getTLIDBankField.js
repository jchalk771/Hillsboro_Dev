getTLIDBankField(fieldName)
 {
	var retValue = null;
	if (doesTLIDRecordExist()) {
		retValue = getAppSpecific(fieldName, getTLIDRecordID());
	}
	return retValue;
}