removeZeroFees()
 {
	var feeArr = loadFees();
	for (x in feeArr) {
		thisFee = feeArr[x];
		if (thisFee.status == "NEW" && thisFee.amount == 0) {
			removeFee(thisFee.code, "STANDARD");
		}
	}
}