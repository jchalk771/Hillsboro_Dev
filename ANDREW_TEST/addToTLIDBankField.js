addToTLIDBankField(fieldName, amtToAdd)
 {

	bankValue = getTLIDBankField(fieldName);
	if (bankValue == null || bankValue == undefined || bankValue == "")
		bankValue = 0;
	else
		bankValue = parseFloat(bankValue);

	if (amtToAdd != null && amtToAdd != "")
		updateTLIDBankField(fieldName, roundNumber(bankValue + parseFloat(amtToAdd), 2));
}