function updateFeeItemInvoiceFlag(feeSeq, finvoice) {
	try {
		
		if (feeSeq == null)
			return;
		if (publicUser && !cap.isCompleteCap()) {
			var feeItemScript = aa.finance.getFeeItemByPK(capId, feeSeq);
			if (feeItemScript.getSuccess) {
				var feeItem = feeItemScript.getOutput().getF4FeeItem();
				feeItem.setAutoInvoiceFlag(finvoice);
				aa.finance.editFeeItem(feeItem);
			}
		}
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function updateFeeItemInvoiceFlag: " + err.message + "In line number: " + err.lineNumber);
	}
}
