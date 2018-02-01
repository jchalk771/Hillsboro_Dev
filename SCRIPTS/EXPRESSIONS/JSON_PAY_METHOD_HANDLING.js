/*---------------------------------------------------------------------------------------
| For use in agencies that do not use native integrated Check and Credit Card Processing
---------------------------------------------------------------------------------------*/
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
var showDebug = true;
var requiredFieldArray = new Array();
var br = "<br />";
var vFormMessage = "The following fields are required: " + br;
var missingReqFields = false;

// Set the form object of the expression. thisForm must be declared in order to support debug
var thisForm = expression.getValue("PAY::FORM");

// Payment Portlet Fields
var servProvCode = expression.getValue("$$servProvCode$$").value;
var method = expression.getValue("PAY::method");
var reference = expression.getValue("PAY::reference");
var comment = expression.getValue("PAY::comment");
var receivedType = expression.getValue("PAY::receivedType");
var ccAuthCode = expression.getValue("PAY::ccAuthCode");

var jsonName = "CONF_PAY_METHOD_HB_RULES";

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
			if (reference.required == true) {
				requiredFieldArray.push(reference);
			}
			reference.hidden = payMethodRules["reference"].hidden;
			reference.readOnly = payMethodRules["reference"].readOnly;
			expression.setReturn(reference);
		}

		if (comment.getViewElementId() != null) {
			comment.required = payMethodRules["comment"].required;
			if (comment.required == true) {
				requiredFieldArray.push(comment);
			}
			comment.hidden = payMethodRules["comment"].hidden;
			comment.readOnly = payMethodRules["comment"].readOnly;
			expression.setReturn(comment);
		}

		if (receivedType.getViewElementId() != null) {
			receivedType.required = payMethodRules["receivedType"].required;
			if (receivedType.required == true) {
				requiredFieldArray.push(receivedType);
			}
			receivedType.hidden = payMethodRules["receivedType"].hidden;
			receivedType.readOnly = payMethodRules["receivedType"].readOnly;
			expression.setReturn(receivedType);
		}

		//ELIMINATING FIELD
		/*if (ccAuthCode.getViewElementId() != null) {
		ccAuthCode.required = payMethodRules["ccAuthCode"].required;
		if (ccAuthCode.required == true) {
		requiredFieldArray.push(ccAuthCode);
		}
		ccAuthCode.hidden = payMethodRules["ccAuthCode"].hidden;
		ccAuthCode.readOnly = payMethodRules["ccAuthCode"].readOnly;
		expression.setReturn(ccAuthCode);
		}*/

	}

}

if (requiredFieldArray.length > 0) {
	for (ea in requiredFieldArray) {
		if (requiredFieldArray[ea].value == null || requiredFieldArray[ea].value == "") {
			var fieldName = requiredFieldArray[ea].name;
			var aliasString = payMethodRules[fieldName].fieldAlias;
			vFormMessage = vFormMessage.concat("<li>" + aliasString + "</li>");
			missingReqFields = true;
		}
	}
}

if (missingReqFields) {
	thisForm.message = notice(vFormMessage, "error");
	expression.setReturn(thisForm);
}
