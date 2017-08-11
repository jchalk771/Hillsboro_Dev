//This function is valid for residential combo and the structural permits
function updateBldgValuationPhasedFees() {
	try {
		logDebug("**Begin updateBldgValuationPhasedFees**");
		//variable declaration
		var totValue = 0; //Value to base permit fees on based on Use Lowest Valuation
		var phaseValue = 0; //Value to base plan review fees on
		var phase1 = false; //Is it Phase 1?
		var phaseOth = false; //Is it Another Phase?
		//var phaseFee = 0;		//Don't like that approach, another meaningless variable

		//get valuations to use for fees and plan review
		//all scenarios
		//recalc brings all assessed fees in line with Use Lowest Valuation - ASIUA and Workflow events
		if (AInfo["Use Lowest Valuation"] != "Yes") {
			if (estValue > calcValue) {
				totValue = estValue;
				aa.finance.reCalculateFees(capId, "CONT", estValue);
			} else {
				totValue = calcValue;
				aa.finance.reCalculateFees(capId, "CALC", calcValue);
			}
		} else {
			if (estValue < calcValue) {
				totValue = estValue;
				aa.finance.reCalculateFees(capId, "CONT", estValue);
			} else {
				totValue = calcValue;
				aa.finance.reCalculateFees(capId, "CALC", calcValue);
			}
		}

		//for when we are phasing for plan review fee assessments
		if (AInfo["Phased Item"] == "Yes") {
			if (AInfo["Phased Requirement"] == "Phase 1") {
				phaseValue = Number(getAppSpecific("Phased Valuation Subject P/R"));
				phase1 = true;
			} else if (AInfo["Phased Requirement"] == "Other Phase") {
				phaseValue = totValue;
				phaseOth = true;
			} else {
				phaseValue = totValue;
				showMessage = true;
				comment("Phased Item is Yes but you have not indicated which phase.  Please update.  Fees will be calculated as a single phase project.");
			}
		}

		//**************************General Rules for Building Permit Fees*******************************************
		//clear off configured Valuation Fees
		if (feeExists("B_STR_005"))
			voidRemoveFees("B_STR_005");

		//Assess the scripted version of the fee based on Use Lowest Valuation
		if (!appMatch("Building/*/Private Utility/NA") && totValue > 0) {
			updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(totValue), "N");
		}

		//check to see if the valuation fee amount has changed, we just updated this, is it ever going to not be the case?
		if (getFeeQty("B_STR_006") != parseFloat(totValue)) {
			qtyChanged = true;
		} else {
			qtyChanged = false;
		}

		//this code feels redundant
		if (!appMatch("Building/*/Private Utility/NA") && totValue > 0 && qtyChanged) {
			updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(totValue), "N");
		}

		//if the current valuation that we are using is 0, drop the building valuation fee to zero
		if (totValue == 0 && feeExists("B_STR_006"))
			reduceFeeAmtToZero("B_STR_006", "B_STR", "STANDARD");

		//**************************Not Phased - Review Fees**************************************************************
		if (!phase1 && !phaseOth) {
			if (totValue > 0) {
				//Assess Building Plan Review Fee
				if (!appMatch("Building/*/Fire/NA") && !appMatch("Building/*/Private Utility/NA")) {
					if (!feeExists("B_STR_160", "INVOICED") || (feeExists("B_STR_160") && qtyChanged)) {
						updateSGFee("B_STR_160", "B_STR", "PLANSTR");
					}
				}

				//Assess Fire/Life/Safety Plan Review Fee
				if (AInfo["Fire / Life / Safety"] == "Yes") {
					if (!feeExists("B_STR_180", "INVOICED") || (feeExists("B_STR_180") && qtyChanged)) {
						updateSGFee("B_STR_180", "B_STR", "PLANFLS");
					}
				}
			}

			//if job value effectively reduced to zero, get rid of Std Review Fees
			if (totValue == 0) {
				if (feeExists("B_STR_160"))
					reduceFeeAmtToZero("B_STR_160", "B_STR", "STANDARD");
				if (feeExists("B_STR_180"))
					reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
			}

			//Get rid of phased fees if they exist
			if (feeExists("B_STR_160P"))
				reduceFeeAmtToZero("B_STR_160P", "B_STR", "STANDARD");
			if (feeExists("B_STR_180P"))
				reduceFeeAmtToZero("B_STR_180P", "B_STR", "STANDARD");
			if (feeExists("B_STR_150P"))
				reduceFeeAmtToZero("B_STR_150P", "B_STR", "STANDARD");
			removeZeroFees();
		}

		//*********************************************Phase 1 - Review Fees**********************************************
		if (phase1) {
			if (phaseValue > 0) {
				//Assess Building Plan Review Fee based on the full project value
				if (!appMatch("Building/*/Fire/NA") && !appMatch("Building/*/Private Utility/NA")) {
					if (!feeExists("B_STR_160P", "INVOICED") || (feeExists("B_STR_160P") && qtyChanged)) {
						updateFeeWithFormula("B_STR_160P", "B_STR", "STANDARD", parseFloat(phaseValue), "N");
					}
				}

				//Assess Fire/Life/Safety Plan Review Fee
				if (AInfo["Fire / Life / Safety"] == "Yes") {
					if (feeExists("B_STR_180P") || !feeExists("B_STR_180P", "INVOICED")) {
						updateFeeWithFormula("B_STR_180P", "B_STR", "STANDARD", parseFloat(phaseValue), "N");
					}
				}
			}

			//if job value effectively reduced to zero, get rid of Phased Plan Review Fees
			if (phaseValue == 0) {
				if (feeExists("B_STR_160P"))
					reduceFeeAmtToZero("B_STR_160P", "B_STR", "STANDARD");
				if (feeExists("B_STR_180P"))
					reduceFeeAmtToZero("B_STR_180P", "B_STR", "STANDARD");
			}

			//Get rid of unphased plan review fees and phased item fees if they exist
			if (feeExists("B_STR_160"))
				reduceFeeAmtToZero("B_STR_160", "B_STR", "STANDARD");
			if (feeExists("B_STR_180"))
				reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
			if (feeExists("B_STR_150P"))
				reduceFeeAmtToZero("B_STR_150P", "B_STR", "STANDARD");
			removeZeroFees();
		}

		//*****************************************Other Phase***************************************************8888
		if (phaseOth) {
			//I don't like this approach
			//if (totValue > 0){
			//var phaseFee = feeAmount("B_STR_006");
			//if (feeExists("B_STR_150P") || !feeExists("B_STR_150P", "INVOICED"))
			//updateFeeWithFormula("B_STR_150P", "B_STR", "STANDARD", parseFloat(phaseFee), "N");
			//}

			//rewriting
			if (phaseValue > 0) {
				//Assess Phased Item "Review" Fee based on the full project value
				if (!appMatch("Building/*/Fire/NA") && !appMatch("Building/*/Private Utility/NA")) {
					if (!feeExists("B_STR_150P", "INVOICED") || (feeExists("B_STR_150P") && qtyChanged)) {
						updateFeeWithFormula("B_STR_150P", "B_STR", "STANDARD", parseFloat(phaseValue), "N");
					}
				}
			}

			//if job value effectively reduced to zero, get rid of Phased Plan Review Fees
			if (phaseValue == 0 && feeExists("B_STR_150P"))
				reduceFeeAmtToZero("B_STR_150P", "B_STR", "STANDARD");

			//Get rid of unphased plan review fees and phase 1 fees if they exist
			if (feeExists("B_STR_160"))
				reduceFeeAmtToZero("B_STR_160", "B_STR", "STANDARD");
			if (feeExists("B_STR_180"))
				reduceFeeAmtToZero("B_STR_180", "B_STR", "STANDARD");
			if (feeExists("B_STR_160P"))
				reduceFeeAmtToZero("B_STR_160P", "B_STR", "STANDARD");
			if (feeExists("B_STR_180P"))
				reduceFeeAmtToZero("B_STR_180P", "B_STR", "STANDARD");
			removeZeroFees();
		}

		//Private Utility, always Contractor Value
		if (appTypeArray[2] == "Private Utility") {
			if (AInfo["Building Valuation Fee"] == "Yes" && estValue > 0)
				updateFeeWithFormula("B_STR_006", "B_STR", "STANDARD", parseFloat(estValue), "N");

			if ((AInfo["Building Valuation Fee"] != "Yes" || estValue == 0) && feeExists("B_STR_006"))
				reduceFeeAmtToZero("B_STR_006", "B_STR", "STANDARD");
		}

		bAltEnergyWaiver();
		logDebug("**End updateBldgValuationPhasedFees**");

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateBldgValuationPhasedFees: " + err.message + "In line number: " + err.lineNumber);
	}
}
