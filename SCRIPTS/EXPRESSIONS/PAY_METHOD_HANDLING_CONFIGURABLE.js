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

var vFormMessage = "";
var br = "<br>";

// Set the form object of the expression. thisForm must be declared in order to support debug
var thisForm = expression.getValue("PAY::FORM");

// Payment Portlet Fields
var servProvCode = expression.getValue("$$servProvCode$$").value;
var method = expression.getValue("PAY::method");
var reference = expression.getValue("PAY::reference");
var comment = expression.getValue("PAY::comment");
var receivedType = expression.getValue("PAY::receivedType");
var ccAuthCode = expression.getValue("PAY::ccAuthCode");

// Solution Configruation
//var solution = "MARIJUANA";
//var jsonFileSuffix = "CONTACT_FIELD_SETTINGS";
//UNIVERSAL, NOT SOLUTION SPECIFIC, NO OPPORTUNITY TO DISTINGUISH BY SOLUTION

var jsonName = "CONF_PAY_METHOD_SETTINGS";

var cfgJsonStr = getScriptText(jsonName);
if (cfgJsonStr == "") {
	logDebug("Error: Unable to load JSON Configuration " + jsonName, "error");
}

var cfgJsonObj = JSON.parse(cfgJsonStr);

if (method && method.value != "") {
	var payMethodRules = cfgJsonObj[method.value];

	if (typeof(payMethodRules) != "object") {
		payMethodRules = cfgJsonObj["DEFAULT"];
	}

	if (typeof(payMethodRules) == "object") {
		// getViewElementId() tells us if the field is on the form
		if (reference.getViewElementId() != null) {
			reference.required = payMethodRules["reference"].required;
			reference.hidden = payMethodRules["reference"].hidden;
			reference.readOnly = payMethodRules["reference"].readOnly;
			expression.setReturn(reference);
		}

		if (comment.getViewElementId() != null) {
			comment.required = payMethodRules["comment"].required;
			comment.hidden = payMethodRules["comment"].hidden;
			comment.readOnly = payMethodRules["comment"].readOnly;
			expression.setReturn(comment);
		}

		if (receivedType.getViewElementId() != null) {
			receivedType.required = payMethodRules["receivedType"].required;
			receivedType.hidden = payMethodRules["receivedType"].hidden;
			receivedType.readOnly = payMethodRules["receivedType"].readOnly;
			expression.setReturn(receivedType);
		}
		if (ccAuthCode.getViewElementId() != null) {
			ccAuthCode.required = payMethodRules["ccAuthCode"].required;
			ccAuthCode.hidden = payMethodRules["ccAuthCode"].hidden;
			ccAuthCode.readOnly = payMethodRules["ccAuthCode"].readOnly;
			expression.setReturn(ccAuthCode);
		}

	}

}

//@TODO - How to properly display a message specific to the missing fields
thisForm.message = vFormMessage;
expression.setReturn(thisForm);

/*  Not invoked here - for development
function objectExplore(objExplore) {
var objectInfo;
//objectInfo += "Object: " + objExplore.getClass() + br;

objectInfo += "Methods:" + br
for (x in objExplore) {
if (typeof(objExplore[x]) == "function")
objectInfo += "   " + x + br;
}

objectInfo += br;
objectInfo += "Properties:" + br;
for (x in objExplore) {
if (typeof(objExplore[x]) != "function")
objectInfo += "   " + x + " = " + objExplore[x] + br;
}
return objectInfo;
}
*/
