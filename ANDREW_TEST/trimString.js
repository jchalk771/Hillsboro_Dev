function trimString(str) {
	while (str.charAt(0) == ' ')
		str = str.substring(1);
	while (str.charAt(str.length - 1) == ' ')
		str = str.substring(0, str.length - 1);
	return str;
}
