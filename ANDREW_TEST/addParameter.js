function addParameter(pamaremeters, key, value) {
	if (key != null) {
		if (value == null) {
			value = "";
		}
		pamaremeters.put(key, value);
	}
}

/*------------------------------------------------------------------------------------------------------/
|  Notification Template Functions (End)
/------------------------------------------------------------------------------------------------------*/

//-----------------------------------------------------------------------------
// Function for finding if ASIT exists