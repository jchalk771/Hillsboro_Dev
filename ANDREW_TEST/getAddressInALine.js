getAddressInALine()
 {

	var capAddrResult = aa.address.getAddressByCapId(capId);
	var addressToUse = null;
	var strAddress = "";

	if (capAddrResult.getSuccess()) {
		var addresses = capAddrResult.getOutput();
		if (addresses) {
			for (zz in addresses) {
				capAddress = addresses[zz];
				if (capAddress.getPrimaryFlag() && capAddress.getPrimaryFlag().equals("Y"))
					addressToUse = capAddress;
			}
			if (addressToUse == null)
				addressToUse = addresses[0];

			if (addressToUse) {
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
				var addPart = addressToUse.getCity();
				if (addPart && addPart != "")
					strAddress += " " + addPart + ",";
				var addPart = addressToUse.getState();
				if (addPart && addPart != "")
					strAddress += " " + addPart;
				var addPart = addressToUse.getZip();
				if (addPart && addPart != "")
					strAddress += " " + addPart;
				return trimString(strAddress);
			}
		}
	}
	return null;
}