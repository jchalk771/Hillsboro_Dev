function getGISInfoWrapper(svc, layer, attributename) {

	var ans = null;
	var retValue = null;
	var treatAsBin = false;

	if (arguments.length > 3)
		treatAsBin = arguments[2];
	ans = getGISInfo(svc, layer, attributename);
	if (ans == undefined || ans == null)
		retValue = "N/A";

	if (treatAsBin) {
		ans = "" + ans;
		if (ans == "0")
			retValue = "No";
		if (ans == "1")
			retValue = "Yes";
	} else {
		ans = getGISInfoArray(svc, layer, attributename);
		if (ans != undefined && ans != null && ans.length > 0) {
			if (ans.length == 1) {
				retValue = ans.toString();
			} else {
				ansArray = new Array();
				for (ansIndex in ans) {
					if (!exists("" + ans[ansIndex], ansArray))
						ansArray.push(ans[ansIndex]);
				}
				retValue = ansArray.toString();
			}
		} else
			retValue = "N/A";
	}
	return retValue;
}
