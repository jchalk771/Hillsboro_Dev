function updateMERRCFee() {
	try {

		merrcTable = loadASITable("MERRC PROGRAM");
		if (merrcTable == "undefined" || merrcTable == null || merrcTable.length == 0) {
			logDebug("merrcTable is: " + typeof("MERRCPROGRAM" == 'object') + "  No MERRC information in ASIT");

			if (feeExists("B_STR_210"))
				reduceFeeAmtToZero("B_STR_210", "B_STR", "STANDARD");

			if (feeExists("B_ADJ_210"))
				reduceFeeAmtToZero("B_ADJ_210", "B_ADJUST", "STANDARD");

			return false;
		} else {
			merrcFeeTTL = sumASITColumn(merrcTable, "Fee", "INCLUDE", "Charge Fee", "Yes");
			logDebug("MERRC Program Fee total is: $" + merrcFeeTTL.toFixed(2));
			updateFee("B_STR_210", "B_STR", "STANDARD", merrcFeeTTL.toFixed(2), "N");
			logDebug("Updated MERRC Fee");
			return true;
		}

	} catch (err) {
		logDebug("A JavaScript Error occurred in updateMERRCFee-INCLUDES_CUSTOM: " + err.message + " In Line " + err.lineNumber);
		return false;
	}
}