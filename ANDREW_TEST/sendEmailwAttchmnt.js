function sendEmailwAttchmnt(fromAddress, toAddress, ccAddress, reportSubject, reportContent, aaReportName, aaReportParamName, aaReportParamValue) {
	var reportName = aaReportName;
	report = aa.reportManager.getReportInfoModelByName(reportName);

	if (report.getSuccess()) {
		report = report.getOutput();
		report.setModule(appTypeArray[0]);
		report.setCapId(capId);
		altId = capId.getCustomID();
		report.getEDMSEntityIdModel().setAltId(altId);
		var parameters = aa.util.newHashMap(); //Make sure the parameters includes some key parameters.
		parameters.put(aaReportParamName, aaReportParamValue);
		parameters.put("addressLine", "addr");
		report.setReportParameters(parameters);

		var permit = aa.reportManager.hasPermission(reportName, currentUserID);
		if (permit.getOutput().booleanValue()) {
			var reportResult = aa.reportManager.getReportResult(report);

			if (reportResult) {
				reportResult = reportResult.getOutput();
				var reportFile = aa.reportManager.storeReportToDisk(reportResult);
				reportFile = reportFile.getOutput();
				var sendResult = aa.sendEmail(fromAddress, toAddress, ccAddress, reportSubject, reportContent, reportFile);
				logDebug("Report " + reportName + " ran successfully");
			} else {
				logDebug("Could not get report from report manager normally, error message please refer to: " + reportResult.getErrorMessage())
			}

			if (sendResult.getSuccess())
				logDebug("A copy of this report has been sent to the valid email addresses.");
			else
				logDebug("System failed send report to selected email addresses because mail server is broken or report file size is great than 5M.");
		} else {
			logDebug("No permission to report: " + reportName + " for Admin" + systemUserObj);
		}
	} else {
		logDebug("Invalid Report Name entered in parameter: " + reportName);
	}
}

/*------------------------------------------------------------------------------------------------------/
|  Notification Template Functions (Start)
/------------------------------------------------------------------------------------------------------*/
