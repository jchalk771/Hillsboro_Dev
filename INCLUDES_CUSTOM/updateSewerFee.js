function updateSewerFee() {
  try{
	asiValue = AInfo["Total Fixture Unit Change"];
	if (asiValue == undefined || asiValue == null || asiValue == "" || parseFloat(asiValue) == 0) {
		if (feeExists("B_SWR_001")) {
			// global fee fix lec 4/30/14 voidRemoveFees("B_SWR_001");
			reduceFeeAmtToZero("B_SWR_001", "B_SWR", "STANDARD");
		}
	} else {
		feeCode = "SWR_RATE";
		fVersion = AInfo["Sewer Fee Calculation Method"];
		if (fVersion != undefined && fVersion != null && fVersion != "") {
			feeItem = getFeeItemByVersion("SEWER_FEES", fVersion, feeCode)
				if (feeItem != null && asiValue > 0) {
					tmpQty = asiValue * feeItem.formula;
					// gff lec 4/30/14 if (feeExists("B_SWR_001") && (tmpQty != getFeeQty("B_SWR_001"))) {
					// gff lec 4/30/14 voidRemoveFees("B_SWR_001");
					//}
					updateFee("B_SWR_001", "B_SWR", "STANDARD", tmpQty, "N");
				}
				else {
					reduceFeeAmtToZero("B_SWR_001", "B_SWR", "STANDARD");
				} 
		} else {
			if (feeExists("B_SWR_001"))
				// gff lec 4/30/14 voidRemoveFees("B_SWR_001");
				reduceFeeAmtToZero("B_SWR_001", "B_SWR", "STANDARD");
		}
	}
  } catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateSewerFee-INCLUDES_CUSTOM: " + err.message + "In line number: " + err.lineNumber);
	}	
}  