getUnpaidFeeBalance()
 {

	totFee = getFeeTotal("NEW", "INVOICED");
	totPay = getPaymentTotal();
	b = totFee - totPay;
	if (b > 0.1)
		return b;
	else
		return 0;

}