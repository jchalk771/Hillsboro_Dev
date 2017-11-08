function engTDTcheck() {
	var J;
	var H;
	J = "false";
	J = doesASITableExistAndHaveSomeValue("TDT SDC INFORMATION");
	if (J == "true") {
		updateTDTFee();
	} else {
		return;
	}
}

/******************************************************************************
 *BEGIN Phased Fees/Use Lowest Valuation Functions and rewrites
 ******************************************************************************/