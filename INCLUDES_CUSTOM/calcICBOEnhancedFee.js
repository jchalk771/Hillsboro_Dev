function calcICBOEnhancedFee(calcVariable, capval) {
	try {
		
		var fee = 0;
		var prevRange = 0;
		var i = 0;
		workVals = calcVariable.split(",");
		if (workVals.length > 3) {
			minFee = parseFloat(workVals[0]);
			feeFactor = parseFloat(workVals[1]);
			divisor = parseFloat(workVals[2]);
			if (divisor == 0)
				divisor = 1;
			prevRange = parseFloat(workVals[3]);
			if (prevRange > capval)
				return minFee + ((roundUpToNearest(capval, divisor) / divisor) * feeFactor);
			else {
				i = 4;
				while (i < workVals.length) {
					var minFee = parseFloat(workVals[i++]);
					var feeFactor = parseFloat(workVals[i++]);
					var divisor = parseInt(workVals[i++]);
					var nextRange = 999999999999;
					if (workVals.length > (i + 1))
						nextRange = workVals[i++];
					if (capval <= nextRange) {
						addtlAmt = ((roundUpToNearest(capval - prevRange, divisor) / divisor) * feeFactor);
						fee = minFee + addtlAmt;
						break;
					}
					prevRange = nextRange;
				}
			}
		}
		logDebug("Fee = " + fee);
		return roundNumber(fee, 2);

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function calcICBOEnhancedFee: " + err.message + "In line number: " + err.lineNumber);
	}
}