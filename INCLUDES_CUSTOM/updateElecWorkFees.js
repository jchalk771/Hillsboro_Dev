//override of existing function to fix single line limitation
function updateElecWorkFees() {

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

	//modifying to fix 1 and 2 family calculations.  -jec, 8.7.2017
	//sfTotal = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "1 & 2 Family")* sumASITColumn(elecTable, "No. of Units","INCLUDE","Type of Unit","1 & 2 Family");
	//getSqFt * unitCt per row and sum, fixing math error
	var sfTotal = 0;
	if (elecTable) {
		for (var ea in elecTable) {
			var row = elecTable[ea];
			var sqFt = row["Sq Ft / Lgst Sq Ft"].fieldValue;
			var colFilter = row["Type of Unit"].fieldValue;
			if (colFilter == "1 & 2 Family") {
				if (!isNaN(parseFloat(sqFt))) {
					var unitCt = row["No. of Units"];
					if (!isNaN(parseFloat(unitCt)))
						sfTotal += (parseFloat(sqFt) * parseFloat(unitCt));
				}
			}
		}
	}

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

}