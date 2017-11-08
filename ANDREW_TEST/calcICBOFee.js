calcICBOFee(calcVariable, capval)
 {
	var fee = 0;
	var prevRange = 0;
	var i = 0;
	workVals = calcVariable.split(",");
	if (workVals.length > 2) {
		fee += parseFloat(workVals[0]);
		prevRange = parseFloat(workVals[1]);
		if (prevRange > capval)
			return fee;
		else {
			i = 2;
			while (i < workVals.length) {
				var feeFactor = parseFloat(workVals[i++]);
				var divisor = parseInt(workVals[i++]);
				var nextRange = 999999999999;
				if (workVals.length > (i + 1))
					nextRange = workVals[i++];
				if (capval <= nextRange) {
					addtlAmt = ((roundUpToNearest(capval - prevRange, divisor) / divisor) * feeFactor);
					fee += addtlAmt;
					break;
				} else {
					// add amount of prev range
					prevRngAmt = ((roundUpToNearest(nextRange - prevRange, divisor) / divisor) * feeFactor);
					fee += prevRngAmt;
				}
				prevRange = nextRange;
			}
		}

	}
	logDebug("Fee = " + fee);
	return roundNumber(fee, 2);
}