sendReadyToIssueEmail(conType)
 {

	conTypeArray = new Array();
	conTypeArray.push(conType);
	if (arguments.length > 1) {
		for (var i = 1; i < arguments.length; i++) {
			conTypeArray.push(arguments[i]);
		}
	}
	var conArray = getContactArray(capId);
	for (thisCon in conArray) {
		conEmail = null;
		b3Contact = conArray[thisCon];
		if (exists(b3Contact["contactType"], conTypeArray)) {
			conEmail = b3Contact["email"];
			//conEmail = "carol.brown@hillsboro-oregon.gov";
			if (conEmail) {
				emailParameters = aa.util.newHashtable();
				addParameter(emailParameters, "$$altid$$", capId.getCustomID());
				addParameter(emailParameters, "$$acaUrl$$", getACASiteUrl() + getACAUrl());
				addParameter(emailParameters, "$$addr$$", getAddressInALine());

				var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
				var fileNames = [];

				aa.document.sendEmailAndSaveAsDocument("no-reply@accela.com", conEmail, "", "READY TO ISSUE APPLICANT EMAIL", emailParameters, capId4Email, fileNames);
				logDebug("Sent Email template READY TO ISSUE APPLICANT EMAIL to " + b3Contact["contactType"] + " : " + conEmail);
			}
		}
	}
}