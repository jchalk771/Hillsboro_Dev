function mechFeeExists() {
	feesch = "B_MECH";

	var feeResult = aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (feesch.equals(feeObjArr[ff].getF4FeeItemModel().getFeeSchudle()))
			return true;

	return false;
}
