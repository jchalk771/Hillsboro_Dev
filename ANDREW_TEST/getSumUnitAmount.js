function getSumUnitAmount() {
	var retValue = 0;
	valObjResult = aa.finance.getCalculatedValuation(capId, null);
	if (valObjResult.getSuccess()) {
		valObj = valObjResult.getOutput();
		if (valObj != null) {
			for (valIndex in valObj) {
				row = valObj[valIndex];
				unitValue = row.getUnitValue();
				if (unitValue != null && unitValue != "")
					retValue += parseFloat(unitValue);
			}
		}
	} else
		logDebug("Error getting calculated valuation " + valObjResult.getErrorMessage());
	return retValue;
}
