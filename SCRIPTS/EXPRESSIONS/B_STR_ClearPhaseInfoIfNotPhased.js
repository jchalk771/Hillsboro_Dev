//B_STR Custom Field Group Execution order 20
//Triggered on Phased Item and Phased Requirement and onSubmit

var servProvCode = expression.getValue("$$servProvCode$$").value;
var isPhased = expression.getValue("ASI::PLAN REVIEW & PHASED PROJECTS::Phased Item");
var phasedRequirement = expression.getValue("ASI::PLAN REVIEW & PHASED PROJECTS::Phased Requirement");
var phValuation = expression.getValue("ASI::PLAN REVIEW & PHASED PROJECTS::Phased Valuation Subject P/R");

var totalRowCount = expression.getTotalRowCount();

if (isPhased.value != null && (isPhased.value.equalsIgnoreCase('NO') || isPhased.value.equalsIgnoreCase('N'))) {
	phasedRequirement.value = String("");
	phasedRequirement.readOnly = true;
	phasedRequirement.required = false;
	expression.setReturn(phasedRequirement);
	phValuation.readOnly = true;
	phValuation.value = String("");
	phValuation.required = false;
	expression.setReturn(phValuation);
} else {
	phasedRequirement.readOnly = false;
	expression.setReturn(phasedRequirement);
	phValuation.readOnly = false;
	expression.setReturn(phValuation);
}
