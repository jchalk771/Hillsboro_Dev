function getFeeDefByCode(fsched, feeCode) {
	try {

		var arrFeesResult = aa.finance.getFeeItemList(null, fsched, null);
		if (arrFeesResult.getSuccess()) {
			var arrFees = arrFeesResult.getOutput();
			for (xx in arrFees) {
				var fCode = arrFees[xx].getFeeCod();
				if (fCode.equals(feeCode)) {
					var f = new FeeDef();
					f.feeCode = fCode;
					f.feeDesc = arrFees[xx].getFeeDes();
					f.formula = arrFees[xx].getFormula();
					f.calcProc = arrFees[xx].getCalProc();
					var rft = arrFees[xx].getrFreeItem();
					f.comments = rft.getComments();
					f.feeMax = roundNumber(arrFees[xx].getMaxFee(), 2);
					f.feeMin = roundNumber(arrFees[xx].getMaxFee(), 2);

					return f;
				}

			} // for xx
		} else {

			logDebug("Error getting fee schedule " + arrFeesResult.getErrorMessage());
			return null;
		}

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function getFeeDefByCode-INCLUDES_CUSTOM: " + err.message + "In line number: " + err.lineNumber);
	}
}
