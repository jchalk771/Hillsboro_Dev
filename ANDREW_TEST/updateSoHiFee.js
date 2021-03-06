function updateSoHiFee() {

	feeCode = "B_PRK_005";
	parkSDCTable = loadASITable("SOHI SUP PARKS SDC INFORMATION");
	if (parkSDCTable == undefined || parkSDCTable == null || parkSDCTable.length == 0) {
		logDebug("No Parks SDC information in ASIT");
		if (feeExists(feeCode))
			reduceFeeAmtToZero(feeCode, "B_PRK", "STANDARD"); // gff 4-30
		return;
	}

	feeSum = sumASITColumn(parkSDCTable, "Line Item Fee Total");
	if (feeSum > 0) {
		//if (feeExists(feeCode) && (feeSum != getFeeQty(feeCode))) {
		//	voidRemoveFees(feeCode);
		//}
		updateFee(feeCode, "B_PRK", "STANDARD", feeSum, "N");
	} else {
		if (feeExists(feeCode))
			//voidRemoveFees(feeCode);
			reduceFeeAmtToZero(feeCode, "B_PRK", "STANDARD"); // gff 4-30

	}
}
