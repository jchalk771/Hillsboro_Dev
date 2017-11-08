function sohiTSDCCcheck() {
	var J;
	var H;
	J = "false";
	J = doesASITableExistAndHaveSomeValue("SOHI TSDC INFORMATION");
	if (J == "true") {
		updateSoHiTSDCFee();
	} else {
		return;
	}
}

// Parks SDC fees
