function sendIssuedEmail(conType) {
	// issued email goes to contractor too
	sendToAddrs = "";
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
			sendToAddrs += b3Contact["email"];
		}
	}
	lpArr = getLicenseProfessional(capId);
	if (lpArr && lpArr != null && lpArr.length > 0) {
		for (lpIndex in lpArr) {
			thisLP = lpArr[lpIndex];
			thisLPEmail = thisLP.getEmail();
			if (thisLPEmail != null && thisLPEmail != "") {
				if (sendToAddrs != "")
					sendToAddrs += ";";
				sendToAddrs += thisLPEmail;
			}

		}
	}
	logDebug("Sending to " + sendToAddrs);
	if (sendToAddrs != "") {
		emailParameters = aa.util.newHashtable();
		addParameter(emailParameters, "$$altid$$", capId.getCustomID());
		addParameter(emailParameters, "$$addr$$", getAddressInALine());
		addParameter(emailParameters, "$$INSPLIST$$", getReqInspOnRecord());

		var capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());
		var fileNames = [];
		//sendToAddrs = "deanna.hoops@woolpert.com;carol.brown@hillsboro-oregon.gov";
		aa.document.sendEmailAndSaveAsDocument("no-reply@accela.com", sendToAddrs, "", "PERMIT ISSUED EMAIL", emailParameters, capId4Email, fileNames);
		logDebug("Sent Email template PERMIT ISSUED email to " + sendToAddrs);
	}

}
