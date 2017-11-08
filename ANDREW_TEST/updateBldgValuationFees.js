function updateBldgValuationFees() {
	try {
		logDebug("**Begin updateBldgValuationFees**");
		if (feeExists("B_STR_005"))
			voidRemoveFees("B_STR_005");

		if (!appMatch("Building/*/Private Utility/NA") && estValue > 0)
			updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(estValue), "N");

		if (getFeeQty("B_STR_006") != parseFloat(estValue)) {
			qtyChanged = true;
		} else {
			qtyChanged = false;
		}

		if (estValue > 0) {

			if (!appMatch("Building/*/Private Utility/NA")) {
				if (qtyChanged)
					updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(estValue), "N");

				if (!appMatch("Building/*/Fire/NA")) {
					if (!feeExists("B_STR_006", "INVOICED") || (feeExists("B_STR_006") && qtyChanged))
						updateSGFee("B_STR_160", "B_STR", "PLANSTR");
				}
			}

			if (feeExists("B_STR_180")) {
				if (AInfo['Fire / Life / Safety'] == "Yes") {
					updateSGFee("B_STR_180", "B_STR", "PLANFLS");
				} else {
					reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
				}
			}

			if (!feeExists("B_STR_180", "INVOICED") && AInfo['Fire / Life / Safety'] == "Yes") {
				updateSGFee("B_STR_180", "B_STR", "PLANFLS");
			}

			if (appMatch("Building/*/Private Utility/NA") && AInfo['Building Valuation Fee'] == "Yes") {
				updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(estValue), "N");
			}

			//redundant
			//if (appMatch("Building/*/Private Utility/NA") && AInfo['Building Valuation Fee'] == "Yes" && qtyChanged) {
			//	updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(estValue), "N");
			//}
		}

		if (estValue == 0) {
			if (feeExists("B_STR_006"))
				reduceFeeAmtToZero("B_STR_006", "B_STR", "STANDARD");
			if (feeExists("B_STR_160"))
				reduceFeeAmtToZero("B_STR_160", "B_STR", "STANDARD");
			if (feeExists("B_STR_180"))
				reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
			if (appMatch("Building/*/Private Utility/NA") && AInfo['Building Valuation Fee'] != "Yes" && feeExists("B_STR_006"))
				reduceFeeAmtToZero("B_STR_006", "B_STR", "STANDARD");
		}

		bAltEnergyWaiver();
		logDebug("**End updateBldgValuationFees**");

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateBldgValuationFees: " + err.message + "In line number: " + err.lineNumber);
	}

}
