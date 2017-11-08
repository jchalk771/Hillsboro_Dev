function updateFeeFromASIWithFormula(ASIField, FeeCode, FeeSchedule) {
	var ASIField;
	var FeeCode;
	var FeeSchedule;
	if (arguments.length == 3) {
		ASIField = arguments[0]; // ASI Field to get the value from
		FeeCode = arguments[1]; // Fee code to update
		FeeSchedule = arguments[2]; // Fee Scheulde for Fee Code
	} else {
		logDebug("Not enought arguments passed to the function: updateFeeFromASI");
	}
	var tmpASIQty = getAppSpecific(ASIField)
		// getAppSpecific returns undefine is ASI field doesn't exist
		// returns null if ASI field exists but no value

		if (tmpASIQty == undefined) {
			logDebug("ASI field " + ASIField + " not defined for this record ");
			return;
		}

		//Check to see if the ASI Field has a value. If so, then check to see if the fee exists.
		if ((tmpASIQty != null) && (tmpASIQty > 0)) {
			logDebug("ASI Field: " + ASIField + " was found and has a positive value. Attempting to update fee information.");
			//If fee already exist and the amount is different than the ASIQty, void or remove it before adding the new qty.
			if (feeExists(FeeCode) && (tmpASIQty != getFeeQty(FeeCode))) {
				logDebug("Existing fee found with quantity: " + getFeeQty(FeeCode) + ". New Quantity is: " + tmpASIQty);
				updateFeeWithFormula(FeeCode, FeeSchedule, "STANDARD", tmpASIQty, "N", "Y");
			} else if (feeExists(FeeCode) && (tmpASIQty == getFeeQty(FeeCode))) {
				logDebug("Existing fee found with quanity: " + getFeeQty(FeeCode) + ". New Quantity is: " + tmpASIQty + ". No changes are being made to fee.");
			}
			//No existing fee is found, add the new fee
			if (feeExists(FeeCode) != true) {
				updateFee(FeeCode, FeeSchedule, "STANDARD", tmpASIQty, "N", "Y");
				logDebug("Fee information has been modified.");
			}
		}
		//ASI Field  has a value <= 0.
		else {
			logDebug("ASI Field: " + ASIField + " is null or has a value <= 0.")
			if (feeExists(FeeCode)) {
				reduceFeeAmtToZero(FeeCode, FeeSchedule, "STANDARD");
			}

		}
}
