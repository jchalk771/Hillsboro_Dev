function roundUpToNearest(x, y) {
	try{
		return (Math.ceil(x / y) * y);
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function roundUpToNearest: " + err.message + "In line number: " + err.lineNumber);
	}	
}