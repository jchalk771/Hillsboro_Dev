assessRevisionFees()
 {

	// Get ASIT rows from the ASIT
	tObj = loadASITable("REVISIONS");

	// An object to store the new/revised ASIT back to the system
	newtObj = new Array();

	// Make sure everything is not null and defined
	if (tObj == undefined || tObj == null || tObj.length == 0)
		return;

	// Go through each row in ASIT
	for (var ea in tObj) {

		// Assign row = current row
		var row = tObj[ea];

		// Make sure these values should be calculated and re-added to the permit
		// If this is "Estimate" or "Complete", no work is done
		if (row["Charge Plan Review"].fieldValue == "Invoiced") {

			// Plan review fee is calculated by a regular expression
			planRevFee = row["Updated Plan Review Fee"].fieldValue;

			// If not null or 0, add the revised fee
			if (planRevFee != null && planRevFee != "") {
				addFee("REV_PLN_REV", "REVISIONS", "STANDARD", parseFloat(planRevFee) - (feeAmount("B_STR_160") + feeAmount("REV_PLN_REV")), "N");
			}

			// Same for FLS (Fire, Life, Safety)
			flsPlanRevFee = row["Updated F/L/S Plan Review Fee"].fieldValue;

			if (flsPlanRevFee != null && flsPlanRevFee != "") {
				addFee("REV_FLS_PLN", "REVISIONS", "STANDARD", parseFloat(flsPlanRevFee) - (feeAmount("B_STR_180") + feeAmount("REV_FLS_PLN")), "N");
			}

			// Set the row to "Complete" so it's not re-assessed later
			row["Charge Plan Review"].fieldValue = "Complete";
		}

		if (row["Charge Permit Fees"].fieldValue == "Invoiced") {

			bldgFee = row["Updated Building Fee"].fieldValue;

			if (bldgFee != null && bldgFee != "") {
				addFee("REV_BLDG", "REVISIONS", "STANDARD", parseFloat(bldgFee) - (feeAmount("B_STR_006") + feeAmount("REV_BLDG")), "N");
			}

			surFee = row["Updated State Surcharge"].fieldValue;

			if (surFee != null && surFee != "") {
				addFee("REV_STSCHG", "REVISIONS", "STANDARD", parseFloat(surFee) - (feeAmount("SURCHRG") + feeAmount("SURCHRG_CALC") + feeAmount("REV_STSCHG")), "N");
			}

			if (ea == tObj.length - 1) { // Make sure we're only running the calculations on the final row of the revisions ASIT table

				// Doesn't make any sense to add fees if they don't apply-- better make sure they're correct
				if (AInfo["Metro CET Applies"] == "Yes" && AInfo["Metro CET Exempt"] != "Yes" && AInfo["Metro CET Refused"] != "Yes") {

					// Take the two boxes, find the new valuation.
					var newValuation = parseInt(row["Current Permit Valuation"]) + parseInt(row["Valuation Change +/-"]);

					// If the new valuation is greater than 100,000 (Metro CET is limited only to valuations over 100k)
					if (newValuation > 100000) {

						// Get fee amount for metro CET and all adjustments (for city)
						var metroCET_City_FeeAmount = feeAmount("B_STR_031") + feeAmount("B_ADJ_065");

						// Get fee ICBO formula
						var metroCET_City_FeeDef = getFeeDefByCode("B_STR", "B_STR_031");

						// Get fee amount for metro CET and all adjustments (for metro)
						var metroCET_Metro_FeeAmount = feeAmount("B_STR_056") + feeAmount("B_ADJ_070");

						// Get fee ICBO formula
						var metroCET_Metro_FeeDef = getFeeDefByCode("B_STR", "B_STR_056");

						// Set the new amount as the calculated fee using the ICBO formula and new valuation, minus the old fee amount
						var metroCET_City_NewAmount = calcICBOFee(metroCET_City_FeeDef.formula, newValuation) - metroCET_City_FeeAmount;
						var metroCET_Metro_NewAmount = calcICBOFee(metroCET_Metro_FeeDef.formula, newValuation) - metroCET_Metro_FeeAmount;

						addFee("B_ADJ_065", "B_ADJUST", "STANDARD", metroCET_City_NewAmount);
						addFee("B_ADJ_070", "B_ADJUST", "STANDARD", metroCET_Metro_NewAmount);

					} else {

						// There shouldn't be a fee since it's below 100k, remove all metro fees
						if (feeExists("B_STR_031")) {
							reduceFeeAmtToZero("B_STR_031", "B_STR", "STANDARD");
						}
						if (feeExists("B_STR_056")) {
							reduceFeeAmtToZero("B_STR_056", "B_STR", "STANDARD");
						}
						if (feeExists("B_ADJ_065")) {
							reduceFeeAmtToZero("B_ADJ_065", "B_ADJUST", "STANDARD");
						}
						if (feeExists("B_ADJ_070")) {
							reduceFeeAmtToZero("B_ADJ_070", "B_ADJUST", "STANDARD");
						}
					}
				}
			}
			// Set the row to "Complete" so it's not assessed again
			row["Charge Permit Fees"].fieldValue = "Complete";
		}
		//Add row to the object
		newtObj.push(row);
	}
	// Delete old ASIT table
	removeASITable("REVISIONS");

	// Replace it with the new one
	addASITable("REVISIONS", newtObj);
}