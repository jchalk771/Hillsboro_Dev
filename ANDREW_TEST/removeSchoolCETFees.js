function removeSchoolCETFees() {

	//var schoolFeeArray = new Array("B_STR_060","B_STR_065","B_STR_090","B_STR_095","B_STR_085","B_STR_070","B_STR_115","B_STR_110");
	var schoolFeeArray = lookup("School_Fee_Code_Lookup", "AllCombinedFees").split("|");

	for (feeItem in schoolFeeArray) {

		var feeCode = schoolFeeArray[feeItem];

		if (feeExists(feeCode)) {
			reduceFeeAmtToZero(feeCode, "B_STR", "STANDARD");
		}
	}

}

/*
 * Custom Function waiveSchoolCETFees
 * To be called from event if Waived or Refused is selected.
 * Call in event script after removeSchoolCETFees
 * Developed for City of Hillsboro
 * 6.10.16 - J Chalk
 */