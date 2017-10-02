function updateValuationFeesPUP() {
	try {
		logDebug("**Begin updateValuationFeesPUP**");
		if (feeExists("B_STR_005")) {
			voidRemoveFees("B_STR_005");
		}

		if (getFeeQty("B_STR_006") != parseFloat(estValue)) {
			qtyChanged = true;
		} else {
			qtyChanged = false;
		}

		//@TODO: Why declare if not using?
		if (getFeeQty("B_STR_180") != parseFloat(estValue)) {
			qtyChangedFLS = true;
		} else {
			qtyChangedFLS = false;
		}

		if (estValue > 0) {
			if ((AInfo['Building Valuation Fee'] == "Yes" || AInfo['Building Valuation Fee'] == "Y")) {
				if (!feeExists("B_STR_006", "INVOICED") || (feeExists("B_STR_006", "INVOICED") && qtyChanged)) {
					updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(estValue), "N");
				}
			}

			//@TODO: I think this should probably be using the qtyChangedFLS....
			if (AInfo['Fire & Life Safety Plan Review'] == "Yes") {
				if (!feeExists("B_STR_180", "INVOICED") || (feeExists("B_STR_180", "INVOICED") && qtyChanged)) {
					updateSGFee("B_STR_180", "B_STR", "PLANFLS");
				}
			}
		}

		//@TODO:where's the row to remove B_STR_006 if Building Valuation Fee != "Yes"?
		if (AInfo['Fire & Life Safety Plan Review'] != "Yes" && feeExists("B_STR_180")) {
			reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
		}

		if (estValue = 0) {
			if (feeExists("B_STR_180")) {
				reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
			}

			if (feeExists("B_STR_006")) {
				reduceFeeAmtToZero("B_STR_006", "B_STR", "STANDARD");
			}
		}

		bAltEnergyWaiver();
		logDebug("**End updateValuationFeesPUP**");

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateValuationFeesPUP: " + err.message + "In line number: " + err.lineNumber);
	}

}