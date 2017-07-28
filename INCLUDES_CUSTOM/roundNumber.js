function roundNumber(num, dec) {
	try{
		var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
		return result;
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function roundNumber: " + err.message + "In line number: " + err.lineNumber);
	}	
}