function loadOneFee(f4Model) {
	try {
		
		var myFee = new Fee();
		myFee.sequence = f4Model.getFeeSeqNbr();
		myFee.code = f4Model.getFeeCod();
		myFee.description = f4Model.getFeeDescription();
		myFee.unit = f4Model.getFeeUnit();
		myFee.amount = f4Model.getFee();
		if (f4Model.getApplyDate())
			myFee.applyDate = convertDate(f4Model.getApplyDate());
		if (f4Model.getEffectDate())
			myFee.effectDate = convertDate(f4Model.getEffectDate());
		if (f4Model.getExpireDate())
			myFee.expireDate = convertDate(f4Model.getExpireDate());
		myFee.status = f4Model.getFeeitemStatus();
		myFee.period = f4Model.getPaymentPeriod();
		myFee.display = f4Model.getDisplay();
		myFee.accCodeL1 = f4Model.getAccCodeL1();
		myFee.accCodeL2 = f4Model.getAccCodeL2();
		myFee.accCodeL3 = f4Model.getAccCodeL3();
		myFee.formula = f4Model.getFormula();
		myFee.udes = f4Model.getUdes();
		myFee.UDF1 = f4Model.getUdf1();
		myFee.UDF2 = f4Model.getUdf2();
		myFee.UDF3 = f4Model.getUdf3();
		myFee.UDF4 = f4Model.getUdf4();
		myFee.subGroup = f4Model.getSubGroup();
		myFee.calcFlag = f4Model.getCalcFlag();
		myFee.calcProc = f4Model.getFeeCalcProc();
		//myFee.schedule = "" + fFee.getF4FeeItemModel().getFeeSchudle();
		return myFee;
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function loadOneFee: " + err.message + "In line number: " + err.lineNumber);
	}
}
