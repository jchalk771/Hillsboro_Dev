function removeZeroFees() {
	try {
		var feeArr = loadFees();
		for (x in feeArr) {
			thisFee = feeArr[x];
			if (thisFee.status == "NEW" && thisFee.amount == 0) {
				removeFee(thisFee.code, "STANDARD");
			}
		}
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function removeZeroFees: " + err.message + "In line number: " + err.lineNumber);
	}
}
