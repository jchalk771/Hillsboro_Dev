function updateElecWorkFees() {
	try {

		elecTable = loadASITable("ELECTRICAL WORK TYPE");
		if (elecTable == undefined || elecTable == null || elecTable.length == 0) {
			logDebug("No Electrical Work type information in ASIT");
			/* if (feeExists("B_ELE_01")) voidRemoveFees("B_ELE_01");*/
			/*RM*/
			if (feeExists("B_ELE_01"))
				reduceFeeAmtToZero("B_ELE_01", "B_ELE", "STANDARD", sfTotal, "N");
			/* if (feeExists("B_ELE_02")) voidRemoveFees("B_ELE_02"); */
			/*RM*/
			if (feeExists("B_ELE_02"))
				reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD", sfTotal, "N");
			return;
		}

		//modifying to fix 1 and 2 family calculations.  -jec, 7.26.2017
        sfTotal = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "1 & 2 Family") * sumASITColumn(elecTable, "No. of Units","INCLUDE","Type of Unit","1 & 2 Family"); 
		//sfTotal = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "1 & 2 Family");
		mfTotal = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "Multi-Family");

		if (sfTotal > 0) {
			/* updateFee("B_ELE_01", "B_ELE", "STANDARD", sfTotal, "N"); */
			/* removed section above and replaced with below 4/10/2014 RM */
			updateFeeWithFormula("B_ELE_01", "B_ELE", "STANDARD", sfTotal, "N");
		} else {
			/* if (feeExists("B_ELE_01")) voidRemoveFees("B_ELE_01"); */
			/* removed section above and replaced with below 4/10/2014 RM */
			if (feeExists("B_ELE_01"))
				reduceFeeAmtToZero("B_ELE_01", "B_ELE", "STANDARD", sfTotal, "N");
		}

		if (mfTotal > 0) {
			feeItem = getFeeDefByCode("B_ELE", "B_ELE_01");
			feeFormula = "" + feeItem.formula;
			baseFee = 0;
			feeIncrement = 0;
			if (feeFormula.indexOf(",") > 0) {
				feeFormulaPieces = feeFormula.split(",");
				if (feeFormulaPieces.length > 5) {
					baseFee = feeFormulaPieces[0];
					feeIncrement = feeFormulaPieces[5];
				}
			}
			numberOfUnits = sumASITColumn(elecTable, "No. of Units");
			if (numberOfUnits > 0 && baseFee > 0) {
				feeAmt = 151.04 + (Math.ceil((mfTotal - 1000) / 1500) * 25.96);
				addAmt = feeAmt / 2;
				for (var i = 0; i < (numberOfUnits - 1); i++) {
					feeAmt += addAmt;
				}
			}
			if (feeAmt > 0)
				updateFee("B_ELE_02", "B_ELE", "STANDARD", feeAmt, "N");

			/* the following else statements changed from voidRemoveFee to reduce fee function 4/10/2014 RM*/
			else
				if (feeExists("B_ELE_02"))
					reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD", sfTotal, "N");
		} else {
			if (feeExists("B_ELE_02"))
				reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD", sfTotal, "N");
		}

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateElecWorkFees: " + err.message + "In line number: " + err.lineNumber);
	}
}
