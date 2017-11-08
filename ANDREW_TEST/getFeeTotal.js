function getFeeTotal() {
	var statusArray = new Array();
	if (arguments.length > 0) {
		for (var i = 0; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(capId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage());
		return false
	}

	for (ff in feeObjArr)
		if (exists(feeObjArr[ff].getFeeitemStatus(), statusArray))
			feeTotal += feeObjArr[ff].getFee()

			return feeTotal;
}
