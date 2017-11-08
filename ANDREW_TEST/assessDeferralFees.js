function assessDeferralFees(feeCode, feeSch) {
	//removeFee(feeCode, "STANDARD");
	feeCount = 0;
	tables = ["LARGE PROJ DEFERRED SUBMITTAL", "PLAN REVIEW DEFERRED SUBMITTAL"];
	for (eachTable in tables) {
		tObj = loadASITable(tables[eachTable]);
		if (tObj == undefined || tObj == null || tObj.length == 0)
			continue;
		for (eachRow in tObj) {
			thisRow = tObj[eachRow];
			dflit = thisRow["Deferral Fee Line Item Total"].fieldValue;
			if (thisRow["Deferral Payment Status"].fieldValue == "Invoiced" || thisRow["Deferral Payment Status"].fieldValue == "Invoice") {
				if (dflit != null && dflit != "")
					//updateFee(feeCode, feeSch, "STANDARD", parseFloat(dflit), "N");
					addFee(feeCode, feeSch, "STANDARD", parseFloat(dflit), "N");
				//if (thisRow["Deferral Review Status"].fieldValue == "Approved") {
				//		feeCount++;
			}
		}
	}
	//if (feeCount > 0) {
	//	updateFee(feeCode, feeSch, "STANDARD", feeCount, "N");
	//}
}
