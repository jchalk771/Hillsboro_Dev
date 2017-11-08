function areAllChildrenFinal() {
	childList = getChildren("*/*/*/*");
	if (childList == null)
		return true;
	for (xx in childList) {
		if (aa.cap.getCap(childList[xx]).getOutput().getCapStatus() != "Finaled") {
			return false;
		}
	}
	return true;
}
