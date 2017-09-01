function updateElecWorkFees() {

	elecTable = loadASITable("ELECTRICAL WORK TYPE");
	if (elecTable == undefined || elecTable == null || elecTable.length == 0) {
		logDebug("No Electrical Work type information in ASIT");
		if (feeExists("B_ELE_01"))
			reduceFeeAmtToZero("B_ELE_01", "B_ELE", "STANDARD");
		if (feeExists("B_ELE_01A"))
			reduceFeeAmtToZero("B_ELE_01A", "B_ELE", "STANDARD");
		if (feeExists("B_ELE_02"))
			reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD");
		return;
	}

	//Clear off legacy Single Family Fee - old, incorrect calculation
	if (feeExists("B_ELE_01"))
		reduceFeeAmtToZero("B_ELE_01", "B_ELE", "STANDARD");

	sfSqFt = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "1 & 2 Family");
	sfUnits = sumASITColumn(elecTable, "No. of Units", "INCLUDE", "Type of Unit", "1 & 2 Family");
	mfSqFt = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "Multi-Family");
	mfUnits = sumASITColumn(elecTable, "No. of Units", "INCLUDE", "Type of Unit", "Multi-Family");
	sfFeeAmt = 0;
	mfFeeAmt = 0;
	logDebug("sfSqFt: " + sfSqFt + ", sfUnits: " + sfUnits + ", mfSqFt: " + mfSqFt + ", mfUnits: " + mfUnits);

	if ((sfSqFt > 0) || (mfSqFt > 0)) {
		feeItem = getFeeDefByCode("B_ELE", "B_ELE_01");
		feeFormula = "" + feeItem.formula;
		baseFee = 0;
		feeIncrement = 0;
		if (feeFormula.indexOf(",") > 0) {
			feeFormulaPieces = feeFormula.split(",");
			if (feeFormulaPieces.length > 5) {
				baseFee = parseFloat(feeFormulaPieces[0]);
				baseCap = parseFloat(feeFormulaPieces[3]);
				feeIncrement = parseFloat(feeFormulaPieces[5]);
				feeIncrementUnit = parseFloat(feeFormulaPieces[6]);
			}
		}
	}

	//logDebug("baseFee: " + baseFee + ", baseCap: " + baseCap + ", feeIncrement: " + feeIncrement + ", feeIncrementUnit: " + feeIncrementUnit);

	if (sfSqFt > 0) {
		if (sfUnits > 0 && baseFee > 0) {
			sfFeeAmt = baseFee + (Math.ceil((sfSqFt - baseCap) / feeIncrementUnit) * feeIncrement);
			sfFeeAmt *= sfUnits;
			sfFeeAmt = roundNumber(sfFeeAmt, 2);
			//logDebug("sfFeeAmt: " + sfFeeAmt);
		}
		if (sfFeeAmt > 0) {
			logDebug("Single Family Electrical Fee is: $" + sfFeeAmt.toFixed(2));
			updateFee("B_ELE_01A", "B_ELE", "STANDARD", sfFeeAmt, "N", "Y");
		} else {
			if (feeExists("B_ELE_01A"))
				reduceFeeAmtToZero("B_ELE_01A", "B_ELE", "STANDARD");
		}
	} else {
		if (feeExists("B_ELE_01A"))
			reduceFeeAmtToZero("B_ELE_01A", "B_ELE", "STANDARD", sfTotal, "N");
	}

	if (mfSqFt > 0) {
		if (mfUnits > 0 && baseFee > 0) {
			mfFeeAmt = baseFee + (Math.ceil((mfSqFt - baseCap) / feeIncrementUnit) * feeIncrement);
			//logDebug("mfFeeAmt at step 1 is: " + mfFeeAmt);
			addAmt = mfFeeAmt / 2;
			logDebug("addAmt at step 1 is: " + addAmt);
			for (var i = 0; i < (mfUnits - 1); i++) {
				mfFeeAmt += addAmt;
			}
			mfFeeAmt = roundNumber(mfFeeAmt, 2);
			//logDebug("mfFeeAmt: " + mfFeeAmt);
		}
		if (mfFeeAmt > 0) {
			logDebug("Multi-Family Electrical Fee is: $" + mfFeeAmt.toFixed(2));
			updateFee("B_ELE_02", "B_ELE", "STANDARD", mfFeeAmt, "N");
		} else {
			if (feeExists("B_ELE_02"))
				reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD", sfTotal, "N");
		}
	} else {
		if (feeExists("B_ELE_02"))
			reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD", sfTotal, "N");
	}

}