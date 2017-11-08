function getSubGrpFeeAmt(subGrp) {
	//Check for a specific status to use, optional argument 1
	var spStatus = "";
	if (arguments.length >= 2) {
		spStatus = arguments[1]
	};

	//Check for a specific FeeCode to exclude, optional argument 2
	var excludedFeeCode = "";
	if (arguments.length == 3) {
		excludedFeeCode = arguments[2]
	};

	if (spStatus != "") {
		logDebug("Getting total fees for Sub Group: " + subGrp + "; Having a status of: " + spStatus)
		var runFeeTot = 0
			var feeA = loadFees()
			for (x in feeA) {
				thisFee = feeA[x];
				if (thisFee.subGroup != null) {
					var thisFeeSubGrp = thisFee.subGroup
						var thisFeeSubGrpAry = thisFeeSubGrp.split(",")
						if (IsStrInArry(subGrp, thisFeeSubGrpAry) && (thisFee.status == spStatus)) {
							//Check to see if fee should be excluded, if not then count it.
							if (excludedFeeCode == thisFee.code) {
								logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
								logDebug("Fee " + thisFee.code + " is excluded from the Running Total: " + runFeeTot);
							}
							//excludedFeeCode is not specified, so count all
							else {
								if (thisFee.description.indexOf("Alternative Energy") < 0) {
									logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
									runFeeTot = runFeeTot + thisFee.amount;
									logDebug("Fee: " + thisFee.code + " added to the running total. Running Total: " + runFeeTot);
								}
							}
						}
				}
			}
	} else {
		logDebug("Getting total fees for Sub Group: " + subGrp + "; Having a status of INVOICED or NEW.")
		var runFeeTot = 0
			var feeA = loadFees()
			for (x in feeA) {
				thisFee = feeA[x];
				if (thisFee.subGroup != null) {
					var thisFeeSubGrp = thisFee.subGroup
						var thisFeeSubGrpAry = thisFeeSubGrp.split(",")
						if (IsStrInArry(subGrp, thisFeeSubGrpAry) && (thisFee.status == "INVOICED" || thisFee.status == "NEW")) {
							if (excludedFeeCode == thisFee.code) {
								logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
								logDebug("Fee " + thisFee.code + " is excluded from the Running Total: " + runFeeTot);
							}
							//excludedFeeCode is not specified, so count all
							else {
								if (thisFee.description.indexOf("Alternative Energy") < 0) {
									logDebug("Fee " + thisFee.code + " found with sub group: " + thisFee.subGroup + "; Amount: " + thisFee.amount + "; Status: " + thisFee.status);
									runFeeTot = runFeeTot + thisFee.amount;
									logDebug("Fee: " + thisFee.code + " added to the running total. Running Total: " + runFeeTot);
								}
							}
						}
				}
			}
	}
	logDebug("Final returned amount: " + runFeeTot);
	return (runFeeTot);
}
