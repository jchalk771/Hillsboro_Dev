updateSoHiTSDCFee()
 {
	logDebug("I'm executing updateSoHiTSDCFEE");
	feeCode = "B_TDT_006";
	tdtSDCTable = loadASITable("SOHI TSDC INFORMATION");
	if (tdtSDCTable == undefined || tdtSDCTable == null || tdtSDCTable.length == 0) {
		logDebug("No South Hillsboro TSDC information in ASIT");
		if (feeExists(feeCode))
			reduceFeeAmtToZero(feeCode, "B_TSDC", "STANDARD");
		return;
	}

	feeSum = sumASITColumn(tdtSDCTable, "Line Item Fee Total");
	if (feeSum > 0) {
		//if (feeExists(feeCode) && (feeSum != getFeeQty(feeCode))) {
		//	voidRemoveFees(feeCode);
		//}
		updateFee(feeCode, "B_TSDC", "STANDARD", feeSum, "N");
	} else {
		if (feeExists(feeCode))
			//voidRemoveFees(feeCode);
			reduceFeeAmtToZero(feeCode, "B_TSDC", "STANDARD");

	}
}