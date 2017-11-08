function getASIFieldValue(fieldname) {
	var asiList;
	asiList = aa.appSpecificInfo.getAppSpecificInfoByCap(cap.getCapModel());

	if (asiList.getSuccess()) {
		var asiGroups = asiList.getOutput();
		var iterGroup = asiGroups.iterator();
		while (iterGroup.hasNext()) {
			var asiGroup = iterGroup.next();
			var asiFields = asiGroup.getFields();
			var iterField = asiFields.iterator();
			while (iterField.hasNext()) {
				var asiField = iterField.next();
				if (fieldname == asiField.getFieldLabel()) {
					return asiField.getChecklistComment();
				}
			}
		}
	}

	return 0;
}
