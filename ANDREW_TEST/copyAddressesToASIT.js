function copyAddressesToASIT(tableName) {

	var capAddrResult = aa.address.getAddressByCapId(capId);
	if (capAddrResult.getSuccess()) {
		var addresses = capAddrResult.getOutput();
		if (addresses) {
			if (addresses.length > 1) {
				for (zz in addresses) {
					addressToUse = addresses[zz];
					if (addressToUse.getPrimaryFlag() == "Y")
						continue;
					strAddress = "";
					var addPart = addressToUse.getHouseNumberStart();
					if (addPart && addPart != "")
						strAddress += " " + addPart;
					var addPart = addressToUse.getStreetDirection();
					if (addPart && addPart != "")
						strAddress += " " + addPart;
					var addPart = addressToUse.getStreetName();
					if (addPart && addPart != "")
						strAddress += " " + addPart;
					var addPart = addressToUse.getStreetSuffix();
					if (addPart && addPart != "")
						strAddress += " " + addPart;
					var addPart = addressToUse.getUnitType();
					if (addPart && addPart != "")
						strAddress += " " + addPart;
					var addPart = addressToUse.getUnitStart();
					if (addPart && addPart != "")
						strAddress += " " + addPart;
					strAddress = trimString(strAddress);

					if (strAddress != "") {
						newRow = new Array();
						newCol = new asiTableValObj("Site Address", strAddress, 'N');
						newRow["Site Address"] = newCol;

						newCol = new asiTableValObj("Days of Week in Operation", "", 'N');
						newRow["Days of Week in Operation"] = newCol;

						newCol = new asiTableValObj("Start Time of Operations", "", 'N');
						newRow["Start Time of Operations"] = newCol;

						newCol = new asiTableValObj("End Time of Operations", "", 'N');
						newRow["End Time of Operations"] = newCol;

						addToASITable(tableName, newRow);
					}
				}
			}
		}
	}
}
