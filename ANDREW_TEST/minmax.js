function minmax(inta, intb, mmflag)
//
//Outputs the higher of two integers if mmflag is 1, and the lower if it is 2
//Optional argument to divide and round the output by a specified increment.
//Example with Standard arguments:
//minmax(0,1,1) returns 1, minmax(0,1,2) returns 0)
//
//Example with optional argument:
//minmax(0,845,1,100) returns 9, minmax(352,1000,2,10) returns 36)
//
//
{
	var incr = 1;
	if (arguments.length == 4)
		incr = arguments[3];

	var wrkVal = 0;

	if (mmflag == 1) {
		if (inta >= intb) {
			if (incr > 1)
				wrkVal = inta;
			else
				return inta;
		} else {
			if (incr > 1)
				wrkVal = intb;
			else
				return intb;
		}
	}
	if (mmflag == 2) {
		if (inta >= intb) {
			if (incr > 1)
				wrkVal = intb;
			else
				return intb;
		} else {
			if (incr > 1)
				wrkVal = inta;
			else
				return inta;
		}
	}
	if (incr > 1) {
		var retQty = parseInt(wrkVal / incr);
		if (retQty < (wrkVal / incr))
			retQty = retQty + 1;
		return retQty;
	}
}
