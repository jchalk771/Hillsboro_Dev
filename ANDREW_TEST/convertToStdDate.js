function convertToStdDate(pDate)
// convert ScriptDateTime to Javascript Date Object format MM/DD/YYYY
{
	var stdDate = dateFormatted(pDate.getMonth(), pDate.getDayOfMonth(), pDate.getYear(), "MM/DD/YYYY");

	return stdDate;
}
