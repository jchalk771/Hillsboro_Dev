function sendEmailWithReport(notificationTemplate, reportName, reportModule) {
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

	// This is where the contacts are retrieved for a record, and put inside of an array
	contactArray = new Array();
	contactArray = getContactArray();

	// Null the FOR loop variable
	iCon = null;

	// The FOR loop basically says, "let us go through each item in the contact array, and do stuff to each record"
	for (iCon in contactArray) {
		// Not entirely sure what this does, but it's being used and works correctly
		contactTypes = new Array("Applicant");

		// If a contact exists
		if (exists(contactArray[iCon]["contactType"], contactTypes)) {

			// Set the current contact we are working on to tContact
			tContact = null;
			tContact = contactArray[iCon];

			// Params used to display information on the message notification template
			params = aa.util.newHashtable();

			// We fill params with data from the record
			getRecordParams4Notification(params);

			// We fill params with data from ACA for the record
			getACARecordParam4Notification(params, acaUrl);

			// We fill params with primary address information for the record
			getPrimaryAddressLineParam4Notification(params);

			// We will params with contact information, and add the e-mail address to tContact
			getContactParams4Notification(params, tContact);

			// Try and catch, that way if this is not being launched by the inspection workflow, it will not fail or exception out
			try {
				// Get inspection information and fill params with it
				getInspectionResultParams4Notification(params);
			} catch (err) {}
			// basically ignores any errors

			// Make sure that tContact["email"] is defined, not null, and not empty
			if (typeof tContact["email"] != "undefined" && tContact["email"] != null && tContact["email"] != "") {
				aa.print(params);
				// Finally send the e-mail
				// First- with report to Applicant
				//sendNotification(fromAddress,tContact["email"],"",notificationTemplate,params,new Array(report));
				// Second - no report email to Applicant
				//sendNotification(fromAddress,tContact["email"],"",notificationTemplate,params,null);
				//Third - Email using template and "To" field from template (not to applicant)
				sendNotification(fromAddress, null, "", notificationTemplate, params, null);
			}
		}
	}
}

//------------- Email without Contact - START


//This version does not check for "Applicant" contact