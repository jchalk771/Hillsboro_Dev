function permitIssueCheckStructural() {

	var allowIssuance = true;
	var sdcFees = AInfo["SDC Fees"];
	var tdtFees = AInfo["TDT Fees"];
	var totalFees = feeBalance();
	logDebug("Total Fees = " + totalFees);

	var sdcBal = 0;
	sdcBal += getFeeBalanceBySubGrp("WTRS");
	sdcBal += getFeeBalanceBySubGrp("WTRC");
	sdcBal += getFeeBalanceBySubGrp("WTRI");
	sdcBal += getFeeBalanceBySubGrp("SWMQL");
	sdcBal += getFeeBalanceBySubGrp("SWMS");
	sdcBal += getFeeBalanceBySubGrp("SWMQUAN");
	sdcBal += getFeeBalanceBySubGrp("SWMSDC");
	sdcBal += getFeeBalanceBySubGrp("PRKS");
	logDebug("SDC Balance = " + sdcBal);

	var tdtBal = 0;
	tdtBal += getFeeBalanceBySubGrp("TDTS");
	logDebug("TDT Balance = " + tdtBal);

	if (totalFees > 0) {
		allowIssuance = false;
		if (sdcFees == "Yes") {
			if (sdcBal == balanceDue)
				allowIssuance = true;
		}
		if (tdtFees == "Yes") {
			if (tdtBal == balanceDue)
				allowIssuance = true;
		}
		if (tdtFees == "Yes" && sdcFees == "Yes") {
			if ((tdtBal + sdcBal) == balanceDue) {
				allowIssuance = true;
			}
		}
	}
	return allowIssuance;
}
