function updateElecWorkFees() {
		try {
			elecTable = loadASITable("ELECTRICAL WORK TYPE");
			if (elecTable == undefined || elecTable == null || elecTable.length == 0 || elecTable == false) {
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

			//Single Family - MultiLine Approach Required (unequal duplexes)

			if (elecTable) {
				var ttlSfFeeAmt = 0;
				for (var ea in elecTable) {
					var sfSqFt = 0;
					var sfUnits = 0;
					var thisSfFeeAmt = 0;

					var row = elecTable[ea];
					var sqFt = row["Sq Ft / Lgst Sq Ft"].fieldValue;
					var colFilter = row["Type of Unit"].fieldValue;
					if (colFilter == "1 & 2 Family") {
						if (!isNaN(parseFloat(sqFt))) {
							var sfUnits = row["No. of Units"];
							if (!isNaN(parseFloat(sfUnits)))
								sfSqFt += (parseFloat(sqFt) * parseFloat(sfUnits));
						}
					}
					if ((sfSqFt > 0) && (sfUnits > 0)) {
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
							logDebug("baseFee: " + baseFee + ", baseCap: " + baseCap + ", feeIncrement: " + feeIncrement + ", feeIncrementUnit: " + feeIncrementUnit);

						}
						if (sfUnits > 0 && baseFee > 0) {
							thisSfFeeAmt = baseFee + (Math.ceil((sfSqFt - baseCap) / feeIncrementUnit) * feeIncrement);
							thisSfFeeAmt *= sfUnits;
							ttlSfFeeAmt += roundNumber(thisSfFeeAmt, 2);
							//logDebug("ttlSfFeeAmt: " + ttlSfFeeAmt);
						}
					}
				}
				if (ttlSfFeeAmt > 0) {
					logDebug("Single Family Electrical Fee is: $" + ttlSfFeeAmt.toFixed(2));
					updateFee("B_ELE_01A", "B_ELE", "STANDARD", ttlSfFeeAmt.toFixed(2), "N", "Y");
				} else {
					if (feeExists("B_ELE_01A"))
						reduceFeeAmtToZero("B_ELE_01A", "B_ELE", "STANDARD");
				}

				//Multi-Family Calculations (Aggregate - Will only be on one line)
				mfSqFt = sumASITColumn(elecTable, "Sq Ft / Lgst Sq Ft", "INCLUDE", "Type of Unit", "Multi-Family");
				mfUnits = sumASITColumn(elecTable, "No. of Units", "INCLUDE", "Type of Unit", "Multi-Family");
				mfFeeAmt = 0;

				if (mfSqFt > 0) {
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
						logDebug("baseFee: " + baseFee + ", baseCap: " + baseCap + ", feeIncrement: " + feeIncrement + ", feeIncrementUnit: " + feeIncrementUnit);
					}

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
						updateFee("B_ELE_02", "B_ELE", "STANDARD", mfFeeAmt.toFixed(2), "N");
					} else {
						if (feeExists("B_ELE_02"))
							reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD");
					}
				} else {
					if (feeExists("B_ELE_02"))
						reduceFeeAmtToZero("B_ELE_02", "B_ELE", "STANDARD");
				}
			}
		} catch (err) {
			logDebug("A JavaScript Error occurred in updateElecWorkFees-INCLUDES_CUSTOM: " + err.message + " In Line " + err.lineNumber);
		}
	}