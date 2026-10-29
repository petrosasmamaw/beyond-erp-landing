export type DomainWorkflowField = {
  name: string;
  label: string;
  type: "text" | "number" | "date";
  required?: boolean;
};

export type DomainWorkflow = {
  key: string;
  sectorId: string;
  recordType: string;
  title: string;
  description: string;
  valueField?: string;
  fields: DomainWorkflowField[];
};

function workflow(
  sectorId: string,
  key: string,
  recordType: string,
  title: string,
  description: string,
  fields: DomainWorkflowField[],
  valueField?: string
): DomainWorkflow {
  return { sectorId, key, recordType, title, description, fields, valueField };
}

export const domainWorkflows: Record<string, DomainWorkflow[]> = {
  "retail-trading": [
    workflow("retail-trading", "sku-inventory", "SKU Inventory", "Create SKU item", "Track item cost, price, and stock on hand.", [
      { name: "sku", label: "SKU", type: "text", required: true },
      { name: "itemName", label: "Item name", type: "text", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      { name: "unitPrice", label: "Unit price", type: "number", required: true }
    ], "unitPrice"),
    workflow("retail-trading", "stock-movement", "Stock Movement", "Record stock movement", "Record stock in, stock out, transfer, or adjustment.", [
      { name: "sku", label: "SKU", type: "text", required: true },
      { name: "movementType", label: "Movement type", type: "text", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true }
    ]),
    workflow("retail-trading", "pos-checkout", "POS Checkout", "Record POS checkout", "Capture checkout total and payment method.", [
      { name: "cashier", label: "Cashier", type: "text", required: true },
      { name: "paymentMethod", label: "Payment method", type: "text", required: true },
      { name: "total", label: "Total", type: "number", required: true }
    ], "total")
  ],
  manufacturing: [
    workflow("manufacturing", "bom-costing", "BOM Costing", "Create BOM costing", "Calculate bill of materials cost for production.", [
      { name: "product", label: "Product", type: "text", required: true },
      { name: "materialCount", label: "Material count", type: "number", required: true },
      { name: "estimatedCost", label: "Estimated cost", type: "number", required: true }
    ], "estimatedCost"),
    workflow("manufacturing", "production-stage", "Production Stage", "Open production stage", "Track batch progress through a manufacturing stage.", [
      { name: "batchNumber", label: "Batch number", type: "text", required: true },
      { name: "stage", label: "Stage", type: "text", required: true },
      { name: "plannedUnits", label: "Planned units", type: "number", required: true }
    ]),
    workflow("manufacturing", "quality-result", "Quality Result", "Record quality result", "Capture passed/failed units and quality notes.", [
      { name: "batchNumber", label: "Batch number", type: "text", required: true },
      { name: "passedUnits", label: "Passed units", type: "number", required: true },
      { name: "failedUnits", label: "Failed units", type: "number", required: true }
    ])
  ],
  agriculture: [
    workflow("agriculture", "crop-cycle", "Crop Cycle", "Start crop cycle", "Track crop type, land area, and planting date.", [
      { name: "crop", label: "Crop", type: "text", required: true },
      { name: "hectares", label: "Hectares", type: "number", required: true },
      { name: "plantingDate", label: "Planting date", type: "date", required: true }
    ]),
    workflow("agriculture", "livestock-event", "Livestock Event", "Record livestock event", "Track veterinary, birth, sale, or transfer events.", [
      { name: "animalGroup", label: "Animal group", type: "text", required: true },
      { name: "eventType", label: "Event type", type: "text", required: true },
      { name: "count", label: "Count", type: "number", required: true }
    ]),
    workflow("agriculture", "harvest-yield", "Harvest Yield", "Record harvest yield", "Capture production volume and estimated value.", [
      { name: "crop", label: "Crop", type: "text", required: true },
      { name: "quantityKg", label: "Quantity kg", type: "number", required: true },
      { name: "estimatedValue", label: "Estimated value", type: "number", required: true }
    ], "estimatedValue")
  ],
  construction: [
    workflow("construction", "project-budget", "Project Budget", "Create project budget", "Track planned budget for a site or milestone.", [
      { name: "project", label: "Project", type: "text", required: true },
      { name: "milestone", label: "Milestone", type: "text", required: true },
      { name: "budget", label: "Budget", type: "number", required: true }
    ], "budget"),
    workflow("construction", "subcontractor-contract", "Subcontractor Contract", "Register subcontractor contract", "Capture contract package, vendor, and value.", [
      { name: "subcontractor", label: "Subcontractor", type: "text", required: true },
      { name: "scope", label: "Scope", type: "text", required: true },
      { name: "contractValue", label: "Contract value", type: "number", required: true }
    ], "contractValue"),
    workflow("construction", "site-report", "Site Report", "Create site report", "Track daily site progress and worker count.", [
      { name: "site", label: "Site", type: "text", required: true },
      { name: "progress", label: "Progress", type: "text", required: true },
      { name: "workers", label: "Workers", type: "number", required: true }
    ])
  ],
  healthcare: [
    workflow("healthcare", "patient-visit", "Patient Visit", "Register patient visit", "Track visit reason, clinician, and fee.", [
      { name: "patientName", label: "Patient name", type: "text", required: true },
      { name: "clinician", label: "Clinician", type: "text", required: true },
      { name: "visitFee", label: "Visit fee", type: "number", required: true }
    ], "visitFee"),
    workflow("healthcare", "prescription-flow", "Prescription Flow", "Create prescription flow", "Track medication and dispensed quantity.", [
      { name: "patientName", label: "Patient name", type: "text", required: true },
      { name: "medicine", label: "Medicine", type: "text", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true }
    ]),
    workflow("healthcare", "lab-pharmacy-flow", "Lab/Pharmacy Flow", "Open lab or pharmacy flow", "Track service type, status, and charge.", [
      { name: "patientName", label: "Patient name", type: "text", required: true },
      { name: "service", label: "Service", type: "text", required: true },
      { name: "charge", label: "Charge", type: "number", required: true }
    ], "charge")
  ],
  education: [
    workflow("education", "student-enrollment", "Student Enrollment", "Enroll student", "Track grade, guardian, and fee.", [
      { name: "studentName", label: "Student name", type: "text", required: true },
      { name: "grade", label: "Grade", type: "text", required: true },
      { name: "fee", label: "Fee", type: "number", required: true }
    ], "fee"),
    workflow("education", "attendance-record", "Attendance Record", "Record attendance", "Capture class attendance counts.", [
      { name: "className", label: "Class", type: "text", required: true },
      { name: "present", label: "Present", type: "number", required: true },
      { name: "absent", label: "Absent", type: "number", required: true }
    ]),
    workflow("education", "grade-book", "Grade Book", "Add grade book entry", "Record student score for a subject.", [
      { name: "studentName", label: "Student name", type: "text", required: true },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "score", label: "Score", type: "number", required: true }
    ])
  ],
  hospitality: [
    workflow("hospitality", "room-calendar", "Room Calendar", "Create room booking", "Track room reservations and nightly rate.", [
      { name: "guestName", label: "Guest name", type: "text", required: true },
      { name: "room", label: "Room", type: "text", required: true },
      { name: "rate", label: "Rate", type: "number", required: true }
    ], "rate"),
    workflow("hospitality", "reservation", "Reservation", "Add reservation", "Capture reservation party and expected value.", [
      { name: "guestName", label: "Guest name", type: "text", required: true },
      { name: "partySize", label: "Party size", type: "number", required: true },
      { name: "estimatedValue", label: "Estimated value", type: "number", required: true }
    ], "estimatedValue"),
    workflow("hospitality", "restaurant-order", "Restaurant Order", "Create restaurant order", "Record table order and total.", [
      { name: "table", label: "Table", type: "text", required: true },
      { name: "server", label: "Server", type: "text", required: true },
      { name: "total", label: "Total", type: "number", required: true }
    ], "total")
  ],
  "transport-logistics": [
    workflow("transport-logistics", "fleet-service", "Fleet Service", "Schedule fleet service", "Track service type and cost.", [
      { name: "vehiclePlate", label: "Vehicle plate", type: "text", required: true },
      { name: "serviceType", label: "Service type", type: "text", required: true },
      { name: "cost", label: "Cost", type: "number", required: true }
    ], "cost"),
    workflow("transport-logistics", "waybill", "Waybill", "Create waybill", "Track origin, destination, and freight charge.", [
      { name: "origin", label: "Origin", type: "text", required: true },
      { name: "destination", label: "Destination", type: "text", required: true },
      { name: "freightCharge", label: "Freight charge", type: "number", required: true }
    ], "freightCharge"),
    workflow("transport-logistics", "delivery-proof", "Delivery Proof", "Record delivery proof", "Capture receiver and delivered package count.", [
      { name: "receiver", label: "Receiver", type: "text", required: true },
      { name: "waybillNumber", label: "Waybill number", type: "text", required: true },
      { name: "packages", label: "Packages", type: "number", required: true }
    ])
  ],
  "finance-banking": [
    workflow("finance-banking", "loan-schedule", "Loan Schedule", "Create loan schedule", "Track principal, interest, and term.", [
      { name: "borrower", label: "Borrower", type: "text", required: true },
      { name: "principal", label: "Principal", type: "number", required: true },
      { name: "termMonths", label: "Term months", type: "number", required: true }
    ], "principal"),
    workflow("finance-banking", "reconciliation", "Reconciliation", "Open reconciliation", "Track account and variance.", [
      { name: "account", label: "Account", type: "text", required: true },
      { name: "period", label: "Period", type: "text", required: true },
      { name: "variance", label: "Variance", type: "number", required: true }
    ], "variance"),
    workflow("finance-banking", "audit-case", "Audit Case", "Open audit case", "Track audit area and risk score.", [
      { name: "area", label: "Area", type: "text", required: true },
      { name: "owner", label: "Owner", type: "text", required: true },
      { name: "riskScore", label: "Risk score", type: "number", required: true }
    ])
  ],
  "real-estate": [
    workflow("real-estate", "property", "Property", "Add property", "Track property listing value.", [
      { name: "propertyCode", label: "Property code", type: "text", required: true },
      { name: "location", label: "Location", type: "text", required: true },
      { name: "value", label: "Value", type: "number", required: true }
    ], "value"),
    workflow("real-estate", "tenant-lease", "Tenant Lease", "Create tenant lease", "Track lease tenant, unit, and monthly rent.", [
      { name: "tenant", label: "Tenant", type: "text", required: true },
      { name: "unit", label: "Unit", type: "text", required: true },
      { name: "monthlyRent", label: "Monthly rent", type: "number", required: true }
    ], "monthlyRent"),
    workflow("real-estate", "rent-schedule", "Rent Schedule", "Create rent schedule", "Track due rent and due date.", [
      { name: "tenant", label: "Tenant", type: "text", required: true },
      { name: "dueDate", label: "Due date", type: "date", required: true },
      { name: "amountDue", label: "Amount due", type: "number", required: true }
    ], "amountDue")
  ],
  "ngo-development": [
    workflow("ngo-development", "donor", "Donor", "Add donor", "Track pledged donor amount.", [
      { name: "donorName", label: "Donor name", type: "text", required: true },
      { name: "program", label: "Program", type: "text", required: true },
      { name: "pledgeAmount", label: "Pledge amount", type: "number", required: true }
    ], "pledgeAmount"),
    workflow("ngo-development", "grant", "Grant", "Register grant", "Track grant budget and compliance owner.", [
      { name: "grantName", label: "Grant name", type: "text", required: true },
      { name: "complianceOwner", label: "Compliance owner", type: "text", required: true },
      { name: "budget", label: "Budget", type: "number", required: true }
    ], "budget"),
    workflow("ngo-development", "beneficiary-impact", "Beneficiary Impact", "Record impact indicator", "Track beneficiaries and impact score.", [
      { name: "indicator", label: "Indicator", type: "text", required: true },
      { name: "beneficiaries", label: "Beneficiaries", type: "number", required: true },
      { name: "impactScore", label: "Impact score", type: "number", required: true }
    ])
  ],
  "government-services": [
    workflow("government-services", "permit", "Permit", "Create permit", "Track permit applicant and fee.", [
      { name: "applicant", label: "Applicant", type: "text", required: true },
      { name: "permitType", label: "Permit type", type: "text", required: true },
      { name: "fee", label: "Fee", type: "number", required: true }
    ], "fee"),
    workflow("government-services", "citizen-case", "Citizen Case", "Open citizen case", "Track service desk case and priority.", [
      { name: "citizenName", label: "Citizen name", type: "text", required: true },
      { name: "serviceType", label: "Service type", type: "text", required: true },
      { name: "priorityScore", label: "Priority score", type: "number", required: true }
    ]),
    workflow("government-services", "revenue-receipt", "Revenue Receipt", "Record revenue receipt", "Track public revenue payment.", [
      { name: "payer", label: "Payer", type: "text", required: true },
      { name: "revenueType", label: "Revenue type", type: "text", required: true },
      { name: "amount", label: "Amount", type: "number", required: true }
    ], "amount")
  ]
};

export function getWorkflow(sectorId: string, workflowKey: string) {
  return domainWorkflows[sectorId]?.find((workflow) => workflow.key === workflowKey);
}
