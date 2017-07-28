function FeeDef() { // Fee Definition object
	try {

		this.formula = null;
		this.feeUnit = null;
		this.feeDesc = null;
		this.feeCode = null;
		this.comments = null;
		this.calcProc = null;
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function FeeDef: " + err.message + "In line number: " + err.lineNumber);
	}
}