function updateWaterMeterBank() {

	var sizeArr = [".75 Inch", "1 Inch", "1,5 Inch", "2 Inch"];
	var totalsArr = new Array();
	tObj = loadASITable("WATER SDC INFO");
	if (tObj == undefined || tObj == null || tObj.length == 0)
		return;
	for (var ea in tObj) {
		var row = tObj[ea];
		var mSize = row["Meter Size"].fieldValue;
		var cType = row["Type of Change"].fieldValue;
		var existUnitField = null;
		var availCreditField = null;
		if (mSize != null && mSize != "" && cType != null && cType != "") {
			switch (String(mSize)) {
			case ".75 Inch":
				existUnitField = "3/4 Inch - Existing Units";
				availCreditField = "3/4 Inch - Available Credits"
					break;
			case "1 Inch":
				existUnitField = "1 inch - Existing Units";
				availCreditField = "1  Inch - Available Credits"
					break;
			case "1.5 Inch":
				existUnitField = "1 1/2 Inch - Existing Units";
				availCreditField = "1 1/2 Inch - Available Credits"
					break;
			case "2 Inch":
				existUnitField = "2 Inches - Existing Units";
				availCreditField = "2 Inches - Available Credits"
					break;
			default:
				break;
			}
			switch (String(cType)) {
			case "Add Unit":

				if (existUnitField != null) {
					logDebug("Adding 1 to bank field " + existUnitField);
					addToTLIDBankField(existUnitField, 1);
				}
				break;
			case "Remove Unit":
				if (existUnitField != null) {
					logDebug("Adding -1 to bank field " + existUnitField);
					addToTLIDBankField(existUnitField, -1);
					logDebug("Adding 1 bank field " + availCreditField);
					addToTLIDBankField(availCreditField, 1);
				}
				break;
			case "Use Unit Credit":
				// amount in the ASIT is negative
				if (existUnitField != null) {
					logDebug("Adding 1 to bank field " + existUnitField);
					addToTLIDBankField(existUnitField, 1);
					logDebug("Adding -1 to bank field " + availCreditField);
					addToTLIDBankField(availCreditField, -1);
				}
				break;
			default:
				break;
			}
		}
	}
}
