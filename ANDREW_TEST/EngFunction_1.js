EngFunction_1()
 {

	var t1;
	var t2;
	var t3;
	var t4;
	var x1;

	t1 = AInfo["Financial Assurance"];
	t2 = AInfo["Certificate of Insurance"];
	t3 = AInfo["Workmens Comp"];
	t4 = AInfo["Contracts"];

	if (((t1 == "Yes") || (t1 == "NA")) &&
		((t2 == "Yes") || (t2 == "NA")) &&
		((t3 == "Yes") || (t3 == "NA")) &&
		((t4 == "Yes") || (t4 == "NA"))) {
		return "Success";
	} else {

		return "Endless Failure";
	}

}