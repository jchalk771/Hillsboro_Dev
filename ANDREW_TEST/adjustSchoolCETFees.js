function adjustSchoolCETFees(appliedDate, recordStatus) {

	var adjustStatus = true;

	//Existing updateFee, updateSG... custom functions also contain check for Recalc Fees = Yes.
	//This function is to augment that in the event that Recalc Fees is not returned to Yes after an adjustment of scope.

	//var inLimboPeriod = null; - Disabling, status rules same for limbo and normal operation
	var recordStatusToExclude = ["About to Expire", "Closed", "Deferred", "Expired", "Finaled", "Withdrawn", "Issued", "Ready to Issue", "Void", "C of O Pending", "Open"];
	//Open and C of O Issued are being included as there are older records in the system within these statuses.
	var appliedDateConverted = convertDate(appliedDate).getTime();
	var oldThresholdDate = new Date("12/09/2013").getTime(); //Date selected based on go-live date, not updating converted records
	//var newThresholdDate = new Date("07/01/2016").getTime(); - Disabling, status rules same for limbo and normal ops

	logDebug("Applied date is: " + appliedDateConverted + " and Threshold Date is: " + oldThresholdDate);

	if (appliedDateConverted < oldThresholdDate) {
		logDebug("Not recalculating because the record was applied for prior to Dec 9, 2013");
		showMessage = true;
		comment("The School CET fees will not be adjusted because the record was created prior to Dec 9, 2013.  Please calculate and assess manually.");
		adjustStatus = false;
	}

	/*  - Disabling, status rules same for limbo and normal ops
	else if ((appliedDateConverted < newThresholdDate) && (appliedDateConverted >= oldThresholdDate)) {
	inLimboPeriod = true;
	logDebug("The record is in the limbo period: Issued between Dec 9, 2013 and July 1, 2016");
	}
	else {
	inLimboPeriod = false;
	logDebug("The record is in the normal period: Issued on or after July 1, 2016");
	}*/

	for (thisStatus in recordStatusToExclude) {
		if (recordStatusToExclude[thisStatus] == recordStatus) {
			logDebug("Not Recalculating because the status: " + recordStatus + " is excluded in the adjustSchoolCETFees function");
			showMessage = true;
			comment("The School CET fees will not be adjusted because the record status is " + recordStatus);
			adjustStatus = false;
		}
	}

	return adjustStatus;
}
