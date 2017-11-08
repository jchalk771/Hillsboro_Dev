getFeeItemByVersion(fSched, fVersion, fCode)
 {
	feeResult = aa.fee.getRefFeeItemByFeeCodeVersion(fSched, fVersion, fCode, "STANDARD", aa.date.getCurrentDate());
	if (feeResult.getSuccess()) {
		feeObj = feeResult.getOutput();
		if (feeObj == null)
			return null;
		var f = new FeeDef();
		f.feeCode = feeObj.getFeeCod();
		f.feeDesc = feeObj.getFeeDes();
		f.formula = feeObj.getFormula();
		f.feeUnit = feeObj.getFeeunit();
		f.feeSch = feeObj.getFeeSchedule();
		f.calcProc = feeObj.getCalProc();
		var rft = feeObj.getrFreeItem();
		f.comments = rft.getComments();
		return f;
	}
	return null;
}