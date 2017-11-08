function updateTDTFee() {

	feeCode = "B_TDT_001";
	tdtSDCTable = loadASITable("TDT SDC INFORMATION");
	if (tdtSDCTable == undefined || tdtSDCTable == null || tdtSDCTable.length == 0) {
		logDebug("No TDT SDC information in ASIT");
		if (feeExists(feeCode))
			reduceFeeAmtToZero(feeCode, "B_TDT", "STANDARD"); // gff 4-30
		return;
	}

	feeSum = sumASITColumn(tdtSDCTable, "Line Item Fee Total");
	if (feeSum > 0) {
		//if (feeExists(feeCode) && (feeSum != getFeeQty(feeCode))) {
		//	voidRemoveFees(feeCode);
		//}
		updateFee(feeCode, "B_TDT", "STANDARD", feeSum, "N");
	} else {
		if (feeExists(feeCode))
			//voidRemoveFees(feeCode);
			reduceFeeAmtToZero(feeCode, "B_TDT", "STANDARD"); // gff 4-30
	}
}
