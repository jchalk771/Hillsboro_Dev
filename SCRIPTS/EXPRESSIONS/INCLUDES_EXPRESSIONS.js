/*********************************************
Script Name: INCLUDES_EXPRESSIONS
Description: This INCLUDES script contains utility functions to support advanced expression development
*********************************************/

function getMessageStyle()
	{
	var cssStyle = "<style>.infoMsg, .successMsg, .warningMsg, .errorMsg, .validationMsg {	\
		margin: 10px 0px; \
		padding:12px;	\
	}	\
	.infoMsg {	\
		color: #00529B;	\
		background-color: #BDE5F8;	\
	}	\
	.successMsg {	\
		color: #4F8A10;	\
		background-color: #DFF2BF;	\
	}	\
	.warningMsg {	\
		color: #9F6000;	\
		background-color: #FEEFB3;	\
	}	\
	.errorMsg {	\
		color: #D8000C;	\
		background-color: #FFBABA;	\
	}	\
	.infoMsg i, .successMsg i, .warningMsg i, .errorMsg i {	\
    margin:10px 22px;	\
    font-size:2em;	\
    vertical-align:middle;	\
	}</style>";
	return cssStyle;
}

function logDebug(dstr)
	{
		var vLevel = "info";
		if (arguments.length == 2) {
			vLevel = arguments[1]; // debug level
		}
		var levelCSS="infoMsg";
		if(vLevel.toUpperCase()=="INFO") levelCSS="infoMsg";
		if(vLevel.toUpperCase()=="SUCCESS") levelCSS="successMsg";
		if(vLevel.toUpperCase()=="WARNING") levelCSS="warningMsg";
		if(vLevel.toUpperCase()=="ERROR") levelCSS="errorMsg";
		var msgFormatted = "<div class=\"" + levelCSS + "\">" + dstr + "</div>";
		debug += msgFormatted;
	}

function notice(dstr)
	{
		var vLevel = "info";
		if (arguments.length == 2) {
			vLevel = arguments[1];
		}
		var levelCSS="infoMsg";
		if(vLevel.toUpperCase()=="INFO") levelCSS="infoMsg";
		if(vLevel.toUpperCase()=="SUCCESS") levelCSS="successMsg";
		if(vLevel.toUpperCase()=="WARNING") levelCSS="warningMsg";
		if(vLevel.toUpperCase()=="ERROR") levelCSS="errorMsg";
		var msgFormatted = getMessageStyle();
		msgFormatted += "<div class=\"" + levelCSS + "\">" + dstr + "</div>";

		return msgFormatted;
	}


function lookup(stdChoice,stdValue)
	{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);

   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
	}



var toPrecision = function (value) {
	var multiplier = 10000;
	return Math.round(value * multiplier) / multiplier;
}

function getFeeItemByVersion(fSched, fVersion, fCode) {

	feeResult = aa.fee.getRefFeeItemByFeeCodeVersion(fSched, fVersion, fCode, "STANDARD", aa.date.getCurrentDate());
	if (feeResult.getSuccess()) {
		feeObj = feeResult.getOutput();
		if (feeObj == null)
			return null;
		var f = new FeeDef();
		f.feeCode = feeObj.getFeeCod();
		f.feeDesc = feeObj.getFeeDes();
		f.formula = feeObj.getFormula();
		f.feeUnit = feeObj.getFeeunit();
		f.feeSch = feeObj.getFeeSchedule();
		f.calcProc = feeObj.getCalProc();
		f.fMax = feeObj.getMaxFee();
		f.fMin = feeObj.getMinFee();
		var rft = feeObj.getrFreeItem();
		f.comments = rft.getComments();
		return f;
	}
	return null;
}

function FeeDef() { // Fee Definition object
	this.formula = null;
	this.feeUnit = null;
	this.feeDesc = null;
	this.feeCode = null;
	this.comments = null;
	this.calcProc = null;
	this.feeMax = null;
	this.feeMin = null;
}

function calcICBOFeeWPrecision(calcVariable, capval, fixedVal) {

	var fee = 0;
	var prevRange = 0;
	var i = 0;
	workVals = calcVariable.split(",");
	if (workVals.length > 2) {
		fee += parseFloat(workVals[0]);
		prevRange = parseFloat(workVals[1]);
		if (prevRange > capval)
			return fee;
		else {
			i = 2;
			while (i < workVals.length) {
				var feeFactor = parseFloat(workVals[i++]);
				var divisor = parseFloat(workVals[i++]).toFixed(fixedVal);
				var nextRange = 999999999999;
				if (workVals.length > (i + 1))
					nextRange = workVals[i++];
				if (capval <= nextRange) {
					addtlAmt = ((roundUpToNearest(capval - prevRange, divisor) / divisor) * feeFactor);
					fee += addtlAmt;
					break;
				} else {
					// add amount of prev range
					prevRngAmt = ((roundUpToNearest(nextRange - prevRange, divisor) / divisor) * feeFactor);
					fee += prevRngAmt;
				}
				prevRange = nextRange;
			}
		}
	}

	return roundNumber(fee, 2);
}

function roundUpToNearest(x, y) {
	return (Math.ceil(x / y) * y);
}

function roundNumber(num, dec) {
	var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	return result;
}