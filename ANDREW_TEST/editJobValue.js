editJobValue(newJobValue)
 {
	var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput();
	if (valobj.length) {
		estValue = valobj[0].getEstimatedValue();
		calcValue = valobj[0].getCalculatedValue();
		feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
		editResult = aa.finance.editBValuatnValue(capId, valobj[0].getValuationPeriod(), newJobValue, feeFactor);
		if (editResult.getSuccess())
			logDebug("Modified job value");
		else
			logDebug("Error editing job value " + editResult.getErrorMessage());
	}
}