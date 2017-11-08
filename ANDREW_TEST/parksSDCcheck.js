function parksSDCcheck() {
	var J;
	var H;
	J = "false";
	J = doesASITableExistAndHaveSomeValue("PARKS SDC INFORMATION");
	if (J == "true") {
		updateParksFee();
	} else {
		return;
	}
}

//Engineering TDT fees
