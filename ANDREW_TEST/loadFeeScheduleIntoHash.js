function loadFeeScheduleIntoHash(fsched) {
	// loads a fee schedule into a hash by feecode

	var fArr = new Array();
	var arrFeesResult = aa.finance.getFeeItemList(null, fsched, null);
	if (arrFeesResult.getSuccess()) {
		var arrFees = arrFeesResult.getOutput();
		for (xx in arrFees) {
			var f = new FeeDef();
			var fCode = arrFees[xx].getFeeCod();
			f.feeCode = fCode;
			f.feeDesc = arrFees[xx].getFeeDes();
			f.formula = arrFees[xx].getFormula();
			f.feeUnit = arrFees[xx].getFeeunit();
			fArr[fCode] = f;
		} // for xx
	} else {
		logDebug("Error getting fee schedule " + arrFeesResult.getErrorMessage());
		return null;
	}
}
