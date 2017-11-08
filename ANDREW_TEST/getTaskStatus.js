function getTaskStatus(wfstr) // optional process name, optional capID
{
	var useProcess = false;
	var processName = "";
	var itemCap = capId;
	if (arguments.length > 1) {
		processName = arguments[1]; // subprocess
		if (processName != null)
			useProcess = true;
	}
	if (arguments.length > 2) {
		itemCap = arguments[2];
	}

	var workflowResult = aa.workflow.getTasks(itemCap);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + workflowResult.getErrorMessage());
		return null;
	}

	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName)))
			return fTask.getDisposition();
	}
	return null;
}
