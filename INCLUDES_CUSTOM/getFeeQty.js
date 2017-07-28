function getFeeQty(FeeCode) {
	try {
		
		var feeA = loadFees(capId);
		var tmpFeeTotQty = 0;

		for (x in feeA) {
			thisFee = feeA[x];

			if (thisFee.code == FeeCode && (thisFee.status == "INVOICED" || thisFee.status == "NEW")) {
				tmpFeeTotQty = tmpFeeTotQty + thisFee.unit;
			}
		}
		return tmpFeeTotQty;
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function getFeeQty: " + err.message + "In line number: " + err.lineNumber);
	}
}
