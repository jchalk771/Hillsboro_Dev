setInspRequired(iGroup, iType)
 {
	var itemCap = capId;
	if (arguments.length == 3) {
		itemCap = arguments[2];
	} // use cap ID specified in args

	var inspResultObj = aa.inspection.getInspections(itemCap);
	if (inspResultObj.getSuccess()) {
		var inspList = inspResultObj.getOutput();
		var createReqInsp = true;

		for (xx in inspList) {
			if (createReqInsp && inspList[xx].getInspectionType().equals(iType) && inspList[xx].getInspection().getActivity().getRequiredInspection().equals("Y")) {
				createReqInsp = false;
			}
		}
		if (createReqInsp) {
			return createPendingReqInspection(iGroup, iType);
		}
	}
	return false;
}