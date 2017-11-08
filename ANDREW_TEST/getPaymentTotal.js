function getPaymentTotal() {
	totalPay = 0;
	var payResult = aa.finance.getPaymentByCapID(capId, null)
		if (!payResult.getSuccess()) {
			logDebug("**ERROR: error retrieving payments " + payResult.getErrorMessage());
			return false
		}

		var payments = payResult.getOutput();
	for (var paynum in payments) {
		var payment = payments[paynum];
		totalPay += payment.getPaymentAmount();
	}
	return totalPay;
}
