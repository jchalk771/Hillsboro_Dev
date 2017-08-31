function getFeeCodeMax(pFeeSched, pFeeCode) {
	try {
		var maxValue = false;
		var arrFeesResult = aa.finance.getFeeItemList(null, pFeeSched, null);
		if (!arrFeesResult.getSuccess()) {
			logDebug("Unable to retrieve fee schedule: " + pFeeSched);
			return false;
		} else {
			var arrFees = arrFeesResult.getOutput();
			for (xx in arrFees) {
				thisFee = arrFees[xx];
				var fCode = thisFee.getFeeCod();
				if (fCode.equals(pFeeCode)) {
					maxValue = roundNumber(thisFee.getMaxFee(), 2).toFixed(2);
					break;
				}
			}

			if (maxValue != null && maxValue != false) {
				logDebug("Max value for fee code " + feeCode + " found: " + maxValue);
				return maxValue;
			} else {
				logDebug("Fee code " + pFeeCode + " has no max value set");
				return false;
			}
		}

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function getFeeCodeMax: " + err.message + "In line number: " + err.lineNumber);
	}
}