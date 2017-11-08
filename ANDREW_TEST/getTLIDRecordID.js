function getTLIDRecordID() {

	retValue = false;
	pNum = getPrimaryParcelNum();
	if (pNum != null) {
		tlidResult = aa.cap.getCapID(pNum);
		if (tlidResult.getSuccess()) {
			tlidCapId = tlidResult.getOutput();
			if (tlidCapId != null) {
				return tlidCapId;
			}
		}
	}
	return retValue;
}
