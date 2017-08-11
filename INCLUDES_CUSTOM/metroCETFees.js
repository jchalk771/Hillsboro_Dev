function metroCETFees() {
	try {
		logDebug("**Begin metroCETFees**");
		var totValue = 0;
		
		if (AInfo["Use Lowest Valuation"] != "Yes") {
			if (estValue > calcValue) {
				totValue = estValue;
				aa.finance.reCalculateFees(capId, "CONT", estValue);
			} else {
				totValue = calcValue;
				aa.finance.reCalculateFees(capId, "CALC", calcValue);
			}
		} else {
			if (estValue < calcValue) {
				totValue = estValue;
				aa.finance.reCalculateFees(capId, "CONT", estValue);
			} else {
				totValue = calcValue;
				aa.finance.reCalculateFees(capId, "CALC", calcValue);
			}
		}
		
		//adding for compatibility - record will have no Use Lowest Valuation Field, not relevant to that type
		if (appTypeArray[2] == "Fire"){
			totValue = estValue;
			aa.finance.reCalculateFees(capId, "CONT", estValue);
		}

		if(AInfo["Metro CET Applies"] == "Yes"){
			
			if(totValue > 100000){
				updateFeeWithFormula("B_STR_056","B_STR", "STANDARD",parseFloat(totValue),"N");  
				updateFeeWithFormula("B_STR_031","B_STR","STANDARD",parseFloat(totValue),"N");
			}
			
			if(totValue <  100000.01){
				reduceFeeAmtToZero("B_STR_056","B_STR", "STANDARD"); 
				reduceFeeAmtToZero("B_STR_031","B_STR", "STANDARD");
			}
				
			if(AInfo["Metro CET Refused"] == "Yes" || AInfo["Metro CET Exempt"] == "Yes"){
				
				if(totValue > 0){
					updateSGFee("B_STR_050","B_STR", "CETMET"); 
					updateSGFee("B_STR_045","B_STR", "CETCITY");
				}	
				if (totValue == 0){
					reduceFeeAmtToZero("B_STR_050", "B_STR", "STANDARD"); 
					reduceFeeAmtToZero("B_STR_045", "B_STR", "STANDARD");
				}
			}	
		}
		
		if(AInfo["Metro CET Applies"] != "Yes"){
		
			if(feeExists("B_STR_056"))
				reduceFeeAmtToZero("B_STR_056","B_STR", "STANDARD");
			if(feeExists("B_STR_030"))
				reduceFeeAmtToZero("B_STR_030","B_STR", "STANDARD");   //two different city fees?
			if(feeExists("B_STR_031"))
				reduceFeeAmtToZero("B_STR_031","B_STR", "STANDARD");
			if((AInfo["Metro CET Refused"] != "Yes" && AInfo["Metro CET Exempt"] != "Yes") && feeExists("B_STR_045"))
				reduceFeeAmtToZero("B_STR_045","B_STR", "STANDARD");   //only waive the city portion?
			
			//@TODO:what about adjustments and waivers?  More than just these codes....
		}
		
		//@TODO:not removing zero fees?
		logDebug("**End metroCETFees**");
		
	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function metroCETFees: " + err.message + "In line number: " + err.lineNumber);
	}
}
