//expression - B_STR Custom Fields Group Execution Order 10
//triggers Phased Item (values Yes/No), Phase Requirement(values Phase 1, Other Phase, No Phase), Phased Valuation Subject P/R text
//additional trigger, onSubmit

//*******************************************Code*****************************************************************
var toPrecision = function (value) {
	var multiplier = 10000;
	return Math.round(value * multiplier) / multiplier;
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var phasedRequirement = expression.getValue("ASI::PLAN REVIEW & PHASED PROJECTS::Phased Requirement");
var isPhased = expression.getValue("ASI::PLAN REVIEW & PHASED PROJECTS::Phased Item");
var phValuation = expression.getValue("ASI::PLAN REVIEW & PHASED PROJECTS::Phased Valuation Subject P/R");



//**************************Phase Requirement triggered actions*********************************************************
//if Phase Requirement = No Phase
//	Update Phased Item to No
//	Phased Valuation Subject to P/R, cleared out and read only
if (phasedRequirement.value != null && phasedRequirement.value.equals(String("No Phase"))) {
	isPhased.value = "No";
	expression.setReturn(isPhased);
	phValuation.required = false;
	phValuation.value = "";
	phValuation.readOnly = true;
	expression.setReturn(phValuation);
}

//if Phase Requirement = Phase 1
//	Update Phased Item to Yes
//	Phased Valuation Subject to P/R read only = false
//	Phased Valuation Subject to P/R is Required
if (phasedRequirement.value != null && phasedRequirement.value.equals(String("Phase 1")) && (phValuation.value == null || phValuation.value * 1 == toPrecision(""))) {
	isPhased.value = "Yes";
	expression.setReturn(isPhased);
	phValuation.required = true;
	phValuation.readOnly = false;
	phValuation.message = "Please Enter the Total Job Valuation";
	expression.setReturn(phValuation);
}

//if Phase Requirement = Other Phase
//	Update Phased Item to Yes
//	Phased Valuation Subject to P/R required = false
if (phasedRequirement.value != null && phasedRequirement.value.equals(String("Other Phase"))) {
	isPhased.value = "Yes";
	expression.setReturn(isPhased);
	phValuation.required = false;
	phValuation.readOnly = false;
	expression.setReturn(phValuation);
}


//if Phased Item = Yes
//	Phase Requirement read only = false
//	Phase Requirement is Required
if ((isPhased.value != null && (isPhased.value.equalsIgnoreCase('YES') || isPhased.value.equalsIgnoreCase('Y'))) && (phasedRequirement.value != null && phasedRequirement.value.equals(String("")))) {
	phasedRequirement.required = true;
	phasedRequirement.readOnly = false;
	phasedRequirement.message = "Please Specify Phase";
	expression.setReturn(phasedRequirement);
}

