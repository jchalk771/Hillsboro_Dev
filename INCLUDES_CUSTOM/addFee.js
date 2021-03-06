function addFee(fcode, fsched, fperiod, fqty, finvoice) {    // Adds a single fee, optional argument: fCap
	try{
		// Updated Script will return feeSeq number or null if error encountered (SR5112)
		var feeCap = capId;
		var feeCapMessage = "";
		var feeSeq_L = new Array(); // invoicing fee for CAP in args
		var paymentPeriod_L = new Array(); // invoicing pay periods for CAP in args
		var feeSeq = null;
		if (arguments.length > 5) {
			feeCap = arguments[5]; // use cap ID specified in args
			feeCapMessage = " to specified CAP";
		}

		recalcFees = getAppSpecific("Recalc Fees");
		if (appTypeArray && appTypeArray[0] == "Building")
			bModule = true;
		else
			bModule = false;

		if (bModule) {
			if (recalcFees != "Yes") {
				logDebug("Not updating fees because ASI field Recalc Fees is not yes");
				return;
			}
		} else {
			if (recalcFees == "No") {
				logDebug("Not updating fees because ASI field Recalc Fees is no");
				return;
			}
		}

		assessFeeResult = aa.finance.createFeeItem(feeCap, fsched, fcode, fperiod, fqty);
		if (assessFeeResult.getSuccess()) {
			feeSeq = assessFeeResult.getOutput();
			logMessage("Successfully added Fee " + fcode + ", Qty " + fqty + feeCapMessage);
			logDebug("The assessed fee Sequence Number " + feeSeq + feeCapMessage);

			if (finvoice == "Y" && arguments.length == 5) // use current CAP
			{
				feeSeqList.push(feeSeq);
				paymentPeriodList.push(fperiod);
			}
			if (finvoice == "Y" && arguments.length > 5) // use CAP in args
			{
				feeSeq_L.push(feeSeq);
				paymentPeriod_L.push(fperiod);
				var invoiceResult_L = aa.finance.createInvoice(feeCap, feeSeq_L, paymentPeriod_L);
				if (invoiceResult_L.getSuccess())
					logMessage("Invoicing assessed fee items" + feeCapMessage + " is successful.");
				else
					logDebug("**ERROR: Invoicing the fee items assessed" + feeCapMessage + " was not successful.  Reason: " + invoiceResult.getErrorMessage());
			}
			updateFeeItemInvoiceFlag(feeSeq, finvoice);
		} else {
			logDebug("**ERROR: assessing fee (" + fcode + "): " + assessFeeResult.getErrorMessage());
			feeSeq = null;
		}

		return feeSeq;
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function addFee: " + err.message + "In line number: " + err.lineNumber);
	}
}
