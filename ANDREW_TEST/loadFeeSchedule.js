function loadFeeSchedule(fsched) {
	// loads a fee schedule into an array

	var fArr = new Array();
	var arrFeesResult = aa.finance.getFeeItemList(null, fsched, null);
	if (arrFeesResult.getSuccess()) {
		var arrFees = arrFeesResult.getOutput();
		for (xx in arrFees) {
			var f = new FeeDef();
			f.feeCode = arrFees[xx].getFeeCod();
			f.feeDesc = arrFees[xx].getFeeDes();
			f.formula = arrFees[xx].getFormula();
			f.feeUnit = arrFees[xx].getFeeunit();
			var rft = arrFees[xx].getrFreeItem();
			f.comments = rft.getComments();
			fArr.push(f);
		} // for xx
	} else {
		logDebug("Error getting fee schedule " + arrFeesResult.getErrorMessage());
		return null;
	}
}
