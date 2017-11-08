function bAltEnergyWaiver() {
	try {
		logDebug("**Begin bAltEnergyWaiver**");
		appElec = false;
		appMech = false;
		appStrc = false;
		appCombo = false;
		appPlum = false;

		if (appMatch("Building/*/Electrical/*")) {
			appElec = true;
		}

		if (appMatch("Building/*/Mechanical/*")) {
			appMech = true;
			logDebug(getFeeTotalBySubGrp("MECH"));
		}

		if (appMatch("Building/*/Structural Permit/*")) {
			appStrc = true;
		}

		if (appMatch("Building/*/Combo/*")) {
			appStrc = true;
			appMech = true;
			appElec = true;
			appPlum = true;
		}

		if (appMatch("Building/*/Plumbing/*")) {
			appPlum = true;
		}

		//@TODO Alternative Energy Defaults to no.  Need to confirm that it is in all Intake forms for this to continue
		//to work.  Otherwise second clause needs to be rewritten as if(AInfo["Alternative Energy"] != "Yes")
		//****************************************Alternative Energy = Yes**************************************
		if (AInfo['Alternative Energy'] == "Yes") {

			//@TODO: This works for records with ASI group B_HIST Building/Historical only.
			//Removes Surcharge from Historical records where Opened Date field is prior to 5/1/2014 (go live date?)
			if (getAppSpecific("Opened Date") < "05/01/2014" && feeExists("SURCHRG"))
				reduceFeeAmtToZero("SURCHRG", "SURCHRG", "STANDARD");

			//Electrical
			if (appElec) {
				if (getFeeTotalBySubGrp("PLANWAIVELE") > 0) {
					updateSGFee("B_ELE_31", "B_ELE", "PLANELE");
				} else {
					reduceFeeAmtToZero("B_ELE_31", "B_ELE", "STANDARD");
				}

				if (getFeeTotalBySubGrp("ELE"))
					updateSGFee("B_ELE_27", "B_ELE", "ELE");

				if (!feeExists("B_ELE_29", "NEW", "INVOICED"))
					reduceFeeAmtToZero("B_ELE_31", "B_ELE", "STANDARD");
			}

			//Mechanical
			if (appMech) {
				if (getFeeTotalBySubGrp("PLANMECH") > 0) {
					updateSGFee("B_MECH_145", "B_MECH", "PLANMECH");
				} else {
					reduceFeeAmtToZero("B_MECH_145", "B_MECH", "STANDARD");
				}

				if (getFeeTotalBySubGrp("MECH"))
					updateSGFee("B_MECH_041", "B_MECH", "MECH");

				if (!feeExists("B_MECH_081", "NEW", "INVOICED"))
					reduceFeeAmtToZero("B_MECH_145", "B_MECH", "STANDARD");
			}

			//Plumbing
			if (appPlum) {

				if (getFeeTotalBySubGrp("PLANWAIVPLM") > 0) {
					updateSGFee("B_PLM_195", "B_PLM", "PLANWAIVPLM");
				} else {
					reduceFeeAmtToZero("B_PLM_195", "B_PLM", "STANDARD");
				}

				if (getFeeTotalBySubGrp("PLUM"))
					updateSGFee("B_PLM_190", "B_PLM", "PLUM");

				if (!feeExists("B_PLM_210", "NEW", "INVOICED"))
					reduceFeeAmtToZero("B_PLM_195", "B_PLM", "STANDARD");
			}

			//Structural
			if (appStrc) {
				if (feeExists("B_STR_160", "NEW", "INVOICED"))
					updateSGFee("B_STR_020", "B_STR", "PRW");

				updateSGFee("B_STR_010", "B_STR", "STR");

				if (feeExists("B_STR_180", "NEW", "INVOICED"))
					updateSGFee("B_STR_015", "B_STR", "FLSW");

				if (!feeExists("B_STR_160", "NEW", "INVOICED"))
					reduceFeeAmtToZero("B_STR_020", "B_STR", "STANDARD");

				if (!feeExists("B_STR_180", "NEW", "INVOICED")) {
					reduceFeeAmtToZero("B_STR_015", "B_STR", "STANDARD");
				}
			}

			if (getAppSpecific("Opened Date") > "05/01/2014")
				updateSGFee("SURCHRG", "SURCHRG", "SURCHRG");
		}

		//************************************Alt Energy = No******************************************************

		//@TODO:  Noted that the 2015 fee schedules only have the last 3 listed here.
		//Was there a policy change in 2015 that the trades were no longer eligible for Alt Energy credit?
		if (AInfo['Alternative Energy'] == "No") {
			if (feeExists("B_ELE_27"))
				reduceFeeAmtToZero("B_ELE_27", "B_ELE", "STANDARD");
			if (feeExists("B_ELE_31"))
				reduceFeeAmtToZero("B_ELE_31", "B_ELE", "STANDARD");
			if (feeExists("B_MECH_041"))
				reduceFeeAmtToZero("B_MECH_041", "B_MECH", "STANDARD");
			if (feeExists("B_MECH_145"))
				reduceFeeAmtToZero("B_MECH_145", "B_MECH", "STANDARD");
			if (feeExists("B_PLM_190"))
				reduceFeeAmtToZero("B_PLM_190", "B_PLM", "STANDARD");
			if (feeExists("B_PLM_195"))
				reduceFeeAmtToZero("B_PLM_195", "B_PLM", "STANDARD");
			if (feeExists("B_STR_010"))
				reduceFeeAmtToZero("B_STR_010", "B_STR", "STANDARD");
			if (feeExists("B_STR_015"))
				reduceFeeAmtToZero("B_STR_015", "B_STR", "STANDARD");
			if (feeExists("B_STR_020"))
				reduceFeeAmtToZero("B_STR_020", "B_STR", "STANDARD");
		}

		if (AInfo['Alternative Energy'] != "Yes")
			updateSGFee("SURCHRG", "SURCHRG", "SURCHRG");

		removeZeroFees();
		logDebug("**End bAltEnergyWaiver**");

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function bAltEnergyWaiver: " + err.message + "In line number: " + err.lineNumber);
	}
}
