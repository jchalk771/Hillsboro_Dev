function calculateFrontageFees() {
	var feeAmt = 0;
	var sfDuplex = false;
	if (appMatch("Building/Sewer/Single Family/NA") || appMatch("Building/Residential/Combo/NA"))
		sfDuplex = true;
	var frontA = AInfo["Frontage Fee Street A"];
	var frontB = AInfo["Frontage Fee Street B"];
	var frontOther = AInfo["Frontage Street Other (C & D)"];

	totalFrontage = 0;
	cornerLot = false;
	feetNotCharged = 0;
	origTotalFrontage = 0;
	if (frontA != undefined && frontA != null && frontA != "")
		totalFrontage += parseFloat(frontA);
	if (frontB != undefined && frontB != null && frontB != "") {
		totalFrontage += parseFloat(frontB);
		cornerLot = true;
	}
	if (frontOther != undefined && frontOther != null && frontOther != "")
		totalFrontage += parseFloat(frontOther);

	origTotalFrontage = totalFrontage;
	if (sfDuplex && cornerLot) {
		totalFrontage = totalFrontage / 2;
		if (totalFrontage > 60)
			feetNotCharged = totalFrontage;
	}

	feeAmt = 1650;
	if (totalFrontage > 60)
		feeAmt += 20 * (totalFrontage - 60);

	var platValue = AInfo["Platted?"];
	platted = false;
	if (platValue != undefined && platValue == "Yes")
		platted = true;

	var zoneValue = "";
	if (vEventName == "ApplicationSubmitAfter") {
		zoningDescription = getGISInfo("HILLSBORO", "Zoning", "DESCRIPTIO");
		if (zoningDescription != undefined && zoningDescription != null && zoningDescription != "")
			zoneValue = zoningDescription;
	} else {
		zoneValue = AInfo["ParcelAttribute.Z_DESCRIPTION"];
	}
	logDebug("Zoning = " + zoneValue);

	if (!platted && matches(zoneValue, "R-10", "R-7", "A-1") && totalFrontage > 125) {
		feeAmt = 1650;
		//if (cornerLot)
		//	feeAmt += 650;
		//else
		feeAmt += 1300;
		feetNotCharged = origTotalFrontage - 125;
	}

	updateFee("B_SWR_006", "B_SWR", "STANDARD", feeAmt, "N");
	if (feetNotCharged > 0)
		editAppSpecific("Lineal Feet Not Charged", feetNotCharged);
	else
		editAppSpecific("Lineal Feet Not Charged", '');
}
