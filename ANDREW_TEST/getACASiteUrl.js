function getACASiteUrl() {
	var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
	acaSite = acaSite.substr(0, acaSite.toUpperCase().indexOf("/ADMIN"));
	return acaSite;
}
