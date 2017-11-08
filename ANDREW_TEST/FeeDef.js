function FeeDef() { // Fee Definition object
	try {

		this.formula = null;
		this.feeUnit = null;
		this.feeDesc = null;
		this.feeCode = null;
		this.comments = null;
		this.calcProc = null;
		this.feeMax = null;
		this.feeMin = null;

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function FeeDef-INCLUDES_CUSTOM: " + err.message + "In line number: " + err.lineNumber);
	}
}
