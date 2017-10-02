/// Parks soHi SDC fees

function sohiParksSDCcheck() {
	var J;
	var H;
	J = "false";
	J = doesASITableExistAndHaveSomeValue("SOHI SUP PARKS SDC INFORMATION");
	if (J == "true") {
		updateSoHiFee();
	} else {
		return;
	}
}