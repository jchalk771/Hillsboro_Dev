/*
Advanced Expression Template
 */
var aa = expression.getScriptRoot(); 
 
function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

// Load includes expressions and required variables
eval(getScriptText("INCLUDES_EXPRESSIONS"));

var debug = "";
debug = getMessageStyle();
var showDebug = false;

// Set the form object of the expression. thisForm must be declared in order to support debug
var thisForm = expression.getValue("PAY::FORM");

// Get global session variables
var servProvCode = expression.getValue("$$servProvCode$$").value;
var recordID = expression.getValue("CAP::capModel*altID").value;
var payMethod = expression.getValue("PAY::method");
var recCCType = expression.getValue("PAY::receivedType");
var refNumber = expression.getValue("PAY::reference");

try {

	if (payMethod.value != null && payMethod.value.equals(String("Credit Card")) && (recCCType.value == null || recCCType.value == "")) {

		refNumber.required = false;
		expression.setReturn(refNumber);

		recCCType.required = true;
		expression.setReturn(recCCType);
		
		thisForm.message = notice("Please Enter the Credit Card Type - Received field Required", "error");
		expression.setReturn(thisForm);
		
	} else if (payMethod.value != null && payMethod.value.equals(String("Check")) && (refNumber.value == null || refNumber.value == "")) {
		
		refNumber.required = true;
		expression.setReturn(refNumber);
		
		recCCType.value = "";
		recCCType.required = false;
		expression.setReturn(recCCType);
		
		thisForm.message = notice("Please Enter the Check Number - Reference # field Required", "error");
		expression.setReturn(thisForm);
		
	} else if (payMethod.value != null && payMethod.value.equals(String("Check")) && (refNumber.value != null || refNumber.value != "")) {

		recCCType.value = "";
		recCCType.required = false;
		expression.setReturn(recCCType);
	}

	//may also need logic for ccAuthCode or refNumber when CC
	//may also need to clear ref number when not equal to CC or Check - check rules.
	
	else {
		recCCType.required = false;
		expression.setReturn(recCCType);

		refNumber.required = false;
		expression.setReturn(refNumber);
	}

} catch (err) {
	logDebug("Expression through an error: " + err, "error");
}



/*** SHOW Debug:  Set the form message = debug when showDebug=true ***/
if (showDebug) {
	thisForm.message = "Debug: <br>" + debug;
	expression.setReturn(thisForm);
}
