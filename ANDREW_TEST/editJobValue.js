function editJobValue(newJobValue) {
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

/* Purpose     : Assess revised fees from ASIT revisions table. If valuation
 *               is below 100k, remove all fees.
 * Called from : ASIUA
 * Record Types: Building/Commercial/Structural Permits/NA,
 *				 Building/Residential/Structural Permits/NA
 * Dependencies: calcICBOFee, feeAmount, addFee removeASITable, addASITable
 * Developed by: Andrew Attebery
 * Created on  : 12/28/2016
 * Modified on :
 */