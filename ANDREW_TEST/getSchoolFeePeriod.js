function getSchoolFeePeriod(pAppliedDate) {

	var period = 0;
	var nAppliedDate = pAppliedDate.getTime();
	var p1Start = new Date("12/09/2013").getTime();
	var p2Start = new Date("07/01/2014").getTime();
	var p3Start = new Date("09/01/2015").getTime();
	var p4Start = new Date("11/01/2015").getTime();
	var p5Start = new Date("07/01/2016").getTime();
	var p6Start = new Date("07/01/2017").getTime();

	if ((nAppliedDate >= p1Start) && (nAppliedDate < p2Start))
		period = 1;

	if ((nAppliedDate >= p2Start) && (nAppliedDate < p3Start))
		period = 2;

	if ((nAppliedDate >= p3Start) && (nAppliedDate < p4Start))
		period = 3;

	if ((nAppliedDate >= p4Start) && (nAppliedDate < p5Start))
		period = 4;

	if ((nAppliedDate >= p5Start) && (nAppliedDate < p6Start)) {
		period = 5;
		logDebug(nAppliedDate + " is between " + p5Start + " and " + p6Start);
	}

	if (nAppliedDate >= p6Start)
		period = 6;

	/*to maintain, modify last if statement with last day of current period and add another open ended if statement at the start date of the

	new period*/

	logDebug("The appropriate period is: " + period);

	return period;
}
