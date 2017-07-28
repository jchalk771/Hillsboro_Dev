function calcFixedFeeByRangeFee(calcVariable, capval) {
	try {
		
		var fee = 0;
		var prevRange = 0;
		var i = 0;
		workVals = calcVariable.split(",");
		if (workVals.length > 2) {
			fee = parseFloat(workVals[0]);
			prevRange = parseFloat(workVals[1]);
			if (prevRange > capval)
				return fee;
			else {
				i = 2;
				while (i < workVals.length) {
					var fee = parseFloat(workVals[i++]);
					var nextRange = 999999999999;
					if (workVals.length > (i + 1))
						nextRange = workVals[i++];
					if (capval <= nextRange) {
						return fee;
					}
					prevRange = nextRange;
				}
			}
		}
		logDebug("Fee = " + fee);
		return roundNumber(fee, 2);

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function calcFixedFeeByRangeFee: " + err.message + "In line number: " + err.lineNumber);
	}
}