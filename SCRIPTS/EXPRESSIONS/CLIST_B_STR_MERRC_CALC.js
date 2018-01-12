//MERRC fee calculation for ASIT: B_STR/MERRC PROGRAM
//Trigger: Square Footage, Calc Method, onSubmit

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
var merrcCalcMethod = expression.getValue("ASIT::MERRC PROGRAM::Calc Method");
var merrcFee = expression.getValue("ASIT::MERRC PROGRAM::Fee");
//var merrcComment = expression.getValue("ASIT::MERRC PROGRAM::Comment");
var thisForm = expression.getValue("ASIT::MERRC PROGRAM::FORM");
var totalRowCount = expression.getTotalRowCount();

//ASIT Logic

for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {

	merrcSqFootageRow = expression.getValue(rowIndex, "ASIT::MERRC PROGRAM::Square Footage");
	merrcCalcMethodRow = expression.getValue(rowIndex, "ASIT::MERRC PROGRAM::Calc Method");
	merrcFeeSchedVersionRow = String(merrcCalcMethodRow.value);
	merrcFeeRow = expression.getValue(rowIndex, "ASIT::MERRC PROGRAM::Fee");
	//merrcComment = expression.getValue(rowIndex, "ASIT::MERRC PROGRAM::Comment");
	
	if (merrcSqFootageRow.value != null && merrcSqFootageRow.value * 1 != null) {

		merrcFeeDef = getFeeItemByVersion("MERRC_CALC", merrcFeeSchedVersionRow.toUpperCase(), "MERRC_01");
		

		if (merrcFeeDef != null) {
			newAmt = calcICBOFeeWPrecision(merrcFeeDef.formula, parseFloat(merrcSqFootageRow.value * 1), 2);
			merrcMaxFee = parseFloat(merrcFeeDef.fMax);

			if (newAmt > merrcMaxFee) {
				merrcFeeRow.value = merrcMaxFee;
			} else {
				merrcFeeRow.value = toPrecision(newAmt);
			}
			expression.setReturn(rowIndex, merrcFeeRow);
		}
	} else {
		merrcFeeRow.value = 0;
		expression.setReturn(rowIndex, merrcFeeRow);
	}
}
