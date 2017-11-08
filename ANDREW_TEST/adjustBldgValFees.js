function adjustBldgValFees(recordStatus) {
	try {
		//Existing fee custom functions also contain check for Recalc Fees = Yes.
		//This function is to augment that in the event that Recalc Fees is not returned to No after an adjustment of scope.
		var adjustStatus = true;

		//Open and C of O Issued are being included as there are older records in the system within these statuses.
		var recordStatusToExclude = ["About to Expire", "Closed", "Deferred", "Expired", "Finaled", "Withdrawn", "Issued", "Ready to Issue", "Void", "C of O Pending", "Open"];

		for (thisStatus in recordStatusToExclude) {
			if (recordStatusToExclude[thisStatus] == recordStatus) {
				logDebug("Not Recalculating because the status: " + recordStatus + " is excluded in the adjustBldgValFees function");
				showMessage = true;
				comment("The Building Valuation fees will not be adjusted because the record status is " + recordStatus);
				adjustStatus = false;
			}
		}
		return adjustStatus;

	} catch (err) {
		logDebug("A JavaScript error has occurred in custom function adjustBldgValFees: " + err.message + "In line number: " + err.lineNumber);
	}
}
