//MERRC fee calculation for ASIT: B_STR/MERRC PROGRAM
//Trigger: Square Footage, onSubmit

//Variable Declarations
var aa = expression.getScriptRoot();
var servProvCode = expression.getValue("$$servProvCode$$").value;

//Load Required Functions
function getScriptText(vScriptName) {
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
	return emseScript.getScriptText() + "";
}

eval(getScriptText("INCLUDES_EXPRESSIONS"));

var debug = "";
debug = getMessageStyle();
var showDebug = false;
var merrcSqFootage = expression.getValue("ASIT::MERRC PROGRAM::Square Footage");
var merrcFee = expression.getValue("ASIT::MERRC PROGRAM::Fee");
var thisForm = expression.getValue("ASIT::MERRC PROGRAM::FORM");
var merrcFeeSchedVersion = "12012017.1";
var totalRowCount = expression.getTotalRowCount();

//ASIT Logic

for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

	merrcFee = expression.getValue(rowIndex, "ASIT::MERRC PROGRAM::Fee");
	merrcSqFootage = expression.getValue(rowIndex, "ASIT::MERRC PROGRAM::Square Footage");
	thisForm = expression.getValue("ASIT::MERRC PROGRAM::FORM");

	if (merrcSqFootage.value != null && merrcSqFootage.value * 1 != null) {

		merrcFeeDef = getFeeItemByVersion("MERRC_CALC", merrcFeeSchedVersion, "MERRC_01");

		if (merrcFeeDef != null) {
			newAmt = calcICBOFeeWPrecision(merrcFeeDef.formula, parseFloat(merrcSqFootage.value * 1), 2);
			merrcMaxFee = parseFloat(merrcFeeDef.fMax);

			if (newAmt > merrcMaxFee) {
				merrcFee.value = merrcMaxFee;
			} else {
				merrcFee.value = toPrecision(newAmt);
			}
			expression.setReturn(rowIndex, merrcFee);
		}
	} else {
		merrcFee.value = 0;
		expression.setReturn(rowIndex, merrcFee);
	}
}
