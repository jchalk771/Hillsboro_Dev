function updateWaterFee(wType) {

	wtrSDCTable = loadASITable("WATER SDC INFO");
	if (wtrSDCTable == undefined || wtrSDCTable == null || wtrSDCTable.length == 0) {
		logDebug("No water SDC information in ASIT");
		if (feeExists("B_WTR_001"))
			reduceFeeAmtToZero("B_WTR_001", "B_WTR", "STANDARD"); /*global fee fix lec 4/30/14*/
		if (feeExists("B_WTR_002"))
			reduceFeeAmtToZero("B_WTR_002", "B_WTR", "STANDARD"); /*global fee fix lec 4/30/14*/
		if (feeExists("B_WTR_003"))
			reduceFeeAmtToZero("B_WTR_003", "B_WTR", "STANDARD"); /*global fee fix lec 4/30/14*/

		return;
	}

	feeCode = "";
	feeSum = 0;
	switch ("" + wType) {
	case "Connection":
		feeCode = "B_WTR_001";
		feeSum = sumASITColumn(wtrSDCTable, "CF");
		break;
	case "Installation":
		feeCode = "B_WTR_002";
		feeSum = sumASITColumn(wtrSDCTable, "SIC");
		break;
	case "SDC":
		feeCode = "B_WTR_003";
		feeSum = sumASITColumn(wtrSDCTable, "SDC");
		break;
	default:
		logDebug("Unknown water fee type");
		break;
	}
	if (feeCode != "") {
		if (feeSum > 0) {
			//if (feeExists(feeCode, "INVOICED")) {
			//	if (getFeeQty(feeCode) != feeSum)
			//		voidRemoveFees(feeCode);
			//}
			logDebug("Updated fee " + feeCode + " with quantity of " + feeSum);
			updateFee(feeCode, "B_WTR", "STANDARD", feeSum, "N");
		} else {
			if (feeExists(feeCode))
				// global fee fix lec 4/30/14 voidRemoveFees(feeCode);
				reduceFeeAmtToZero(feeCode, "B_WTR", "STANDARD");
		}
	}
}
