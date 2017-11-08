overTurnParent(wfDateStr)
 {

	var pId = getParent();
	var decisionFieldName = "Decision Status";
	if (pId != undefined && pId != null) {
		var pMatch = false;
		if (appMatch("Planning/Type I/Modification/*", pId)) {
			pMatch = true;
			decisionFieldName = "Decision";
		}
		if (appMatch("Planning/Type II/*/*", pId) && !appMatch("Planning/Type II/Final Plat/Subdivision", pId))
			pMatch = true;
		if (appMatch("Planning/Type III/*/*", pId) && !appMatch("Planning/Type III/Annexation/NA", pId) && !appMatch("Planning/Type III/Miscellaneous/*", pId))
			pMatch = true;
		if (appMatch("Planning/Type IV/*/*", pId) && !appMatch("Planning/Type IV/Subdivision Ordinance Amend/*", pId) && !appMatch("Planning/Type IV/Zone Ordinance Amendment/*", pId))
			pMatch = true;
		if (pMatch) {

			pDecisionStatus = getTaskStatus("Issue Decision", null, pId);
			pDecisionDate = getTaskStatusDate("Issue Decision");
			if (matches(pDecisionStatus, "Approved", "Approved w/ Condition", "Approved w/Cond")) {

				updateTask("Issue Decision", "Denied", "set by script", "", "", pId);

				editAppSpecific(decisionFieldName, "Denied", pId);
				if (pDecisionDate != null)
					editAppSpecific("Decision Date", pDecisionDate, pId);
			}
			if (matches(pDecisionStatus, "Denied")) {
				updateTask("Issue Decision", "Approved", "set by script", "", "", pId);
				editAppSpecific(decisionFieldName, "Approved", pId);
				if (pDecisionDate != null)
					editAppSpecific("Decision Date", pDecisionDate, pId);
			}
		}
	}
}