EngFunction_2()
 {

	var e1;
	var e2;
	var e3;
	var e4;
	var e5;
	var e6
	var e7

	e1 = AInfo["1 Year Maintenance Assurance"];
	e2 = AInfo["2 Year Maintenance Assurance"];
	e3 = AInfo["Certificate of Completion"];
	e4 = AInfo["Project Completion Sheet"];
	e5 = AInfo["Record Drawings"];
	e6 = AInfo["Certificate of Water Quality"];
	e7 = AInfo["Legal Documents Recorded"];

	if (((e1 == "Yes") || (e1 == "NA")) &&
		((e2 == "Yes") || (e2 == "NA")) &&
		((e3 == "Yes") || (e3 == "NA")) &&
		((e4 == "Yes") || (e4 == "NA")) &&
		((e5 == "Yes") || (e5 == "NA")) &&
		((e6 == "Yes") || (e6 == "NA")) &&
		((e7 == "Yes") || (e7 == "NA"))) {

		return "Success";
	} else {

		return "Abject Failure";
	}

}