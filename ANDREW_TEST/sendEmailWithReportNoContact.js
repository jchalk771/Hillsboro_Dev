sendEmailWithReportNoContact(notificationTemplate, reportName, reportModule)
 {
	acaUrl = "";
	fromAddress = "noreply@hillsboro-oregon.gov";

	// The parameters being passed to generate the report
	// depends entirely upon which report, as they all use different parameters.
	parameters = aa.util.newHashMap();

	// In most cases, it'll be the unique ID for the record
	parameters.put("altId", capIDString);

	// Null the report variable
	report = null;

	// Generate the report that will be attached to the e-mail
	report = generateReport(reportName, parameters, reportModule, capIDString);

	// Params used to display information on the message notification template
	params = aa.util.newHashtable();

	// We fill params with data from the record
	getRecordParams4Notification(params);

	// We fill params with data from ACA for the record
	getACARecordParam4Notification(params, acaUrl);

	// We fill params with primary address information for the record
	getPrimaryAddressLineParam4Notification(params);

	// Try and catch, that way if this is not being launched by the inspection workflow, it will not fail or exception out
	try {
		// Get inspection information and fill params with it
		getInspectionResultParams4Notification(params);
	} catch (err) {}
	// basically ignores any errors


	//Third - Email using template and "To" field from template (not to applicant)
	sendNotification(fromAddress, null, "", notificationTemplate, params, null);
}