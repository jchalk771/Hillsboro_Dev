function getFeeTotalBySubGrp(sGroup) {
	try {
		
		var retValue = 0;
		var feeArr = loadFees();
		for (fIndex in feeArr) {
			thisFee = feeArr[fIndex];
			if (thisFee.status == "INVOICED" || thisFee.status == "NEW") {
				if (thisFee.subGroup != null && thisFee.subGroup != "") {
					var thisSubGroup = "" + thisFee.subGroup;
					if (thisSubGroup.indexOf(sGroup) >= 0) {
						retValue += thisFee.amount;
					}
				}
			}
		}
		return retValue;
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function getFeeTotalBySubGrp: " + err.message + "In line number: " + err.lineNumber);
	}
}
