export type PatientStatus = "Active" | "Discharged" | "Critical" | "Referred";
export type AppointmentStatus = "Scheduled" | "Confirmed" | "In Progress" | "Completed" | "No-Show" | "Cancelled";
export type AppointmentType = "Consultation" | "Follow-up" | "Emergency" | "Procedure";
export type DrugStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expiring Soon";
export type PrescriptionStatus = "Active" | "Dispensed" | "Cancelled" | "Expired";
export type LabStatus = "Pending" | "Sample Collected" | "Processing" | "Result Ready" | "Reported";
export type LabPriority = "Normal" | "Urgent" | "STAT";
export type BillStatus = "Pending" | "Partial" | "Paid" | "Insurance" | "Waived";

export type Patient = {
  id: string;
  mrn: string;
  fullName: string;
  age: number;
  gender: "Male" | "Female";
  phone: string;
  bloodType: string;
  status: PatientStatus;
  lastVisit: string;
  nextVisit?: string;
  diagnosis: string;
  doctor: string;
};

export type Appointment = {
  id: string;
  patientName: string;
  mrn: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
};

export type Drug = {
  id: string;
  name: string;
  genericName: string;
  category: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
};

export type Prescription = {
  id: string;
  rxNumber: string;
  patientName: string;
  mrn: string;
  doctor: string;
  date: string;
  status: PrescriptionStatus;
  drugs: { name: string; dosage: string; frequency: string; duration: string }[];
  notes?: string;
};

export type LabRequest = {
  id: string;
  reqNumber: string;
  patientName: string;
  mrn: string;
  testName: string;
  category: string;
  requestedBy: string;
  date: string;
  priority: LabPriority;
  status: LabStatus;
  result?: string;
  cost: number;
};

export type HealthBill = {
  id: string;
  billNumber: string;
  patientName: string;
  mrn: string;
  date: string;
  services: string[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: string;
  status: BillStatus;
  insuranceProvider?: string;
};

// ─── Mock Patients ──────────────────────────────────────────────────────────

export const mockPatients: Patient[] = [
  { id: "p1", mrn: "MRN-00124", fullName: "Abebe Girma", age: 45, gender: "Male", phone: "+251911234567", bloodType: "A+", status: "Active", lastVisit: "2026-05-20", nextVisit: "2026-06-03", diagnosis: "Type 2 Diabetes", doctor: "Dr. Tigist Alemu" },
  { id: "p2", mrn: "MRN-00125", fullName: "Selam Tadesse", age: 32, gender: "Female", phone: "+251922345678", bloodType: "O+", status: "Active", lastVisit: "2026-05-22", nextVisit: "2026-05-29", diagnosis: "Hypertension", doctor: "Dr. Yonas Bekele" },
  { id: "p3", mrn: "MRN-00126", fullName: "Dawit Mekonnen", age: 67, gender: "Male", phone: "+251933456789", bloodType: "B-", status: "Critical", lastVisit: "2026-05-25", diagnosis: "Acute MI, Post-surgery", doctor: "Dr. Hiwot Haile" },
  { id: "p4", mrn: "MRN-00127", fullName: "Meron Hailu", age: 28, gender: "Female", phone: "+251944567890", bloodType: "AB+", status: "Active", lastVisit: "2026-05-18", nextVisit: "2026-06-15", diagnosis: "Prenatal Check-up", doctor: "Dr. Tigist Alemu" },
  { id: "p5", mrn: "MRN-00128", fullName: "Tesfaye Worku", age: 54, gender: "Male", phone: "+251955678901", bloodType: "O-", status: "Discharged", lastVisit: "2026-05-15", diagnosis: "Appendectomy Recovery", doctor: "Dr. Yonas Bekele" },
  { id: "p6", mrn: "MRN-00129", fullName: "Hanna Lemma", age: 19, gender: "Female", phone: "+251966789012", bloodType: "A-", status: "Active", lastVisit: "2026-05-23", nextVisit: "2026-06-06", diagnosis: "Asthma Management", doctor: "Dr. Biruk Desta" },
  { id: "p7", mrn: "MRN-00130", fullName: "Solomon Kebede", age: 72, gender: "Male", phone: "+251977890123", bloodType: "B+", status: "Critical", lastVisit: "2026-05-26", diagnosis: "COPD Exacerbation", doctor: "Dr. Hiwot Haile" },
  { id: "p8", mrn: "MRN-00131", fullName: "Liya Girma", age: 41, gender: "Female", phone: "+251988901234", bloodType: "O+", status: "Active", lastVisit: "2026-05-21", nextVisit: "2026-06-21", diagnosis: "Thyroid Disorder", doctor: "Dr. Biruk Desta" },
  { id: "p9", mrn: "MRN-00132", fullName: "Bereket Assefa", age: 35, gender: "Male", phone: "+251999012345", bloodType: "A+", status: "Referred", lastVisit: "2026-05-19", diagnosis: "Suspected Lymphoma", doctor: "Dr. Yonas Bekele" },
  { id: "p10", mrn: "MRN-00133", fullName: "Almaz Tesfaye", age: 58, gender: "Female", phone: "+251900123456", bloodType: "AB-", status: "Active", lastVisit: "2026-05-24", nextVisit: "2026-06-07", diagnosis: "Osteoarthritis", doctor: "Dr. Hiwot Haile" },
  { id: "p11", mrn: "MRN-00134", fullName: "Robel Tekle", age: 23, gender: "Male", phone: "+251911234568", bloodType: "O+", status: "Discharged", lastVisit: "2026-05-10", diagnosis: "Fractured Radius, Healed", doctor: "Dr. Biruk Desta" },
  { id: "p12", mrn: "MRN-00135", fullName: "Sara Mulugeta", age: 49, gender: "Female", phone: "+251922345679", bloodType: "B+", status: "Active", lastVisit: "2026-05-26", nextVisit: "2026-06-09", diagnosis: "Chronic Kidney Disease", doctor: "Dr. Tigist Alemu" },
];

// ─── Mock Appointments ───────────────────────────────────────────────────────

export const mockAppointments: Appointment[] = [
  { id: "a1", patientName: "Abebe Girma", mrn: "MRN-00124", doctor: "Dr. Tigist Alemu", department: "Internal Medicine", date: "2026-05-26", time: "08:30", type: "Follow-up", status: "Completed" },
  { id: "a2", patientName: "Selam Tadesse", mrn: "MRN-00125", doctor: "Dr. Yonas Bekele", department: "Cardiology", date: "2026-05-26", time: "09:00", type: "Consultation", status: "Confirmed" },
  { id: "a3", patientName: "Dawit Mekonnen", mrn: "MRN-00126", doctor: "Dr. Hiwot Haile", department: "ICU", date: "2026-05-26", time: "09:30", type: "Procedure", status: "In Progress" },
  { id: "a4", patientName: "Meron Hailu", mrn: "MRN-00127", doctor: "Dr. Tigist Alemu", department: "OB/GYN", date: "2026-05-26", time: "10:00", type: "Follow-up", status: "Scheduled" },
  { id: "a5", patientName: "Hanna Lemma", mrn: "MRN-00129", doctor: "Dr. Biruk Desta", department: "Pulmonology", date: "2026-05-26", time: "10:30", type: "Follow-up", status: "Confirmed" },
  { id: "a6", patientName: "Liya Girma", mrn: "MRN-00131", doctor: "Dr. Biruk Desta", department: "Endocrinology", date: "2026-05-26", time: "11:00", type: "Follow-up", status: "Scheduled" },
  { id: "a7", patientName: "Tesfaye Worku", mrn: "MRN-00128", doctor: "Dr. Yonas Bekele", department: "Surgery", date: "2026-05-27", time: "08:00", type: "Follow-up", status: "Scheduled" },
  { id: "a8", patientName: "Almaz Tesfaye", mrn: "MRN-00133", doctor: "Dr. Hiwot Haile", department: "Orthopedics", date: "2026-05-27", time: "09:30", type: "Consultation", status: "Scheduled" },
  { id: "a9", patientName: "Sara Mulugeta", mrn: "MRN-00135", doctor: "Dr. Tigist Alemu", department: "Nephrology", date: "2026-05-27", time: "10:00", type: "Follow-up", status: "Scheduled" },
  { id: "a10", patientName: "Bereket Assefa", mrn: "MRN-00132", doctor: "Dr. Yonas Bekele", department: "Oncology", date: "2026-05-25", time: "09:00", type: "Consultation", status: "No-Show" },
  { id: "a11", patientName: "Solomon Kebede", mrn: "MRN-00130", doctor: "Dr. Hiwot Haile", department: "Pulmonology", date: "2026-05-26", time: "11:30", type: "Emergency", status: "In Progress" },
  { id: "a12", patientName: "Robel Tekle", mrn: "MRN-00134", doctor: "Dr. Biruk Desta", department: "Orthopedics", date: "2026-05-28", time: "08:30", type: "Follow-up", status: "Scheduled" },
];

// ─── Mock Drugs ──────────────────────────────────────────────────────────────

export const mockDrugs: Drug[] = [
  { id: "d1", name: "Metformin 500mg", genericName: "Metformin HCl", category: "Antidiabetic", stock: 480, unit: "Tablet", reorderLevel: 100, expiryDate: "2027-08-31", costPrice: 2.5, sellingPrice: 4.0, supplier: "Ethiopian Pharm" },
  { id: "d2", name: "Amlodipine 5mg", genericName: "Amlodipine Besylate", category: "Antihypertensive", stock: 35, unit: "Tablet", reorderLevel: 50, expiryDate: "2027-03-31", costPrice: 3.0, sellingPrice: 5.5, supplier: "Medico Ethiopia" },
  { id: "d3", name: "Amoxicillin 250mg", genericName: "Amoxicillin Trihydrate", category: "Antibiotic", stock: 8, unit: "Capsule", reorderLevel: 60, expiryDate: "2026-06-30", costPrice: 1.8, sellingPrice: 3.2, supplier: "Ethiopian Pharm" },
  { id: "d4", name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "Analgesic", stock: 1200, unit: "Tablet", reorderLevel: 200, expiryDate: "2027-12-31", costPrice: 0.5, sellingPrice: 1.0, supplier: "Medico Ethiopia" },
  { id: "d5", name: "Atorvastatin 20mg", genericName: "Atorvastatin Calcium", category: "Statin", stock: 210, unit: "Tablet", reorderLevel: 60, expiryDate: "2027-09-30", costPrice: 4.0, sellingPrice: 7.5, supplier: "MedPharm PLC" },
  { id: "d6", name: "Salbutamol Inhaler", genericName: "Albuterol", category: "Bronchodilator", stock: 18, unit: "Inhaler", reorderLevel: 20, expiryDate: "2026-07-15", costPrice: 45.0, sellingPrice: 72.0, supplier: "Medico Ethiopia" },
  { id: "d7", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "PPI", stock: 390, unit: "Capsule", reorderLevel: 80, expiryDate: "2026-06-15", costPrice: 2.2, sellingPrice: 4.0, supplier: "Ethiopian Pharm" },
  { id: "d8", name: "Furosemide 40mg", genericName: "Furosemide", category: "Diuretic", stock: 0, unit: "Tablet", reorderLevel: 50, expiryDate: "2027-05-31", costPrice: 1.5, sellingPrice: 2.8, supplier: "MedPharm PLC" },
  { id: "d9", name: "Ceftriaxone 1g", genericName: "Ceftriaxone Sodium", category: "Antibiotic", stock: 44, unit: "Vial", reorderLevel: 15, expiryDate: "2027-01-31", costPrice: 35.0, sellingPrice: 60.0, supplier: "Ethiopian Pharm" },
  { id: "d10", name: "Insulin Glargine", genericName: "Insulin Glargine", category: "Insulin", stock: 12, unit: "Pen", reorderLevel: 20, expiryDate: "2026-08-31", costPrice: 280.0, sellingPrice: 420.0, supplier: "MedPharm PLC" },
  { id: "d11", name: "Diazepam 5mg", genericName: "Diazepam", category: "Anxiolytic", stock: 95, unit: "Tablet", reorderLevel: 30, expiryDate: "2027-11-30", costPrice: 2.0, sellingPrice: 3.5, supplier: "Medico Ethiopia" },
  { id: "d12", name: "Hydrocortisone 100mg", genericName: "Hydrocortisone", category: "Corticosteroid", stock: 60, unit: "Vial", reorderLevel: 20, expiryDate: "2026-06-01", costPrice: 18.0, sellingPrice: 30.0, supplier: "Ethiopian Pharm" },
];

// ─── Mock Prescriptions ──────────────────────────────────────────────────────

export const mockPrescriptions: Prescription[] = [
  { id: "rx1", rxNumber: "RX-2026-0084", patientName: "Abebe Girma", mrn: "MRN-00124", doctor: "Dr. Tigist Alemu", date: "2026-05-20", status: "Active", drugs: [{ name: "Metformin 500mg", dosage: "500mg", frequency: "Twice daily", duration: "30 days" }, { name: "Atorvastatin 20mg", dosage: "20mg", frequency: "Once at night", duration: "30 days" }] },
  { id: "rx2", rxNumber: "RX-2026-0085", patientName: "Selam Tadesse", mrn: "MRN-00125", doctor: "Dr. Yonas Bekele", date: "2026-05-22", status: "Dispensed", drugs: [{ name: "Amlodipine 5mg", dosage: "5mg", frequency: "Once daily", duration: "60 days" }] },
  { id: "rx3", rxNumber: "RX-2026-0086", patientName: "Hanna Lemma", mrn: "MRN-00129", doctor: "Dr. Biruk Desta", date: "2026-05-23", status: "Active", drugs: [{ name: "Salbutamol Inhaler", dosage: "100mcg", frequency: "As needed", duration: "90 days" }, { name: "Omeprazole 20mg", dosage: "20mg", frequency: "Once before breakfast", duration: "14 days" }] },
  { id: "rx4", rxNumber: "RX-2026-0087", patientName: "Dawit Mekonnen", mrn: "MRN-00126", doctor: "Dr. Hiwot Haile", date: "2026-05-25", status: "Active", drugs: [{ name: "Furosemide 40mg", dosage: "40mg", frequency: "Once daily", duration: "7 days" }, { name: "Ceftriaxone 1g", dosage: "1g IV", frequency: "Every 12 hours", duration: "5 days" }] },
  { id: "rx5", rxNumber: "RX-2026-0088", patientName: "Liya Girma", mrn: "MRN-00131", doctor: "Dr. Biruk Desta", date: "2026-05-21", status: "Dispensed", drugs: [{ name: "Paracetamol 500mg", dosage: "500mg", frequency: "Three times daily", duration: "7 days" }] },
  { id: "rx6", rxNumber: "RX-2026-0089", patientName: "Almaz Tesfaye", mrn: "MRN-00133", doctor: "Dr. Hiwot Haile", date: "2026-05-24", status: "Active", drugs: [{ name: "Diazepam 5mg", dosage: "5mg", frequency: "At bedtime", duration: "14 days" }, { name: "Paracetamol 500mg", dosage: "1g", frequency: "Three times daily", duration: "10 days" }] },
  { id: "rx7", rxNumber: "RX-2026-0083", patientName: "Solomon Kebede", mrn: "MRN-00130", doctor: "Dr. Hiwot Haile", date: "2026-05-26", status: "Active", drugs: [{ name: "Salbutamol Inhaler", dosage: "200mcg", frequency: "Every 4 hours", duration: "5 days" }, { name: "Hydrocortisone 100mg", dosage: "100mg IV", frequency: "Every 8 hours", duration: "3 days" }] },
  { id: "rx8", rxNumber: "RX-2026-0082", patientName: "Bereket Assefa", mrn: "MRN-00132", doctor: "Dr. Yonas Bekele", date: "2026-05-19", status: "Cancelled", drugs: [{ name: "Paracetamol 500mg", dosage: "500mg", frequency: "As needed", duration: "7 days" }] },
];

// ─── Mock Lab Requests ───────────────────────────────────────────────────────

export const mockLabRequests: LabRequest[] = [
  { id: "l1", reqNumber: "LAB-2026-0201", patientName: "Abebe Girma", mrn: "MRN-00124", testName: "HbA1c", category: "Biochemistry", requestedBy: "Dr. Tigist Alemu", date: "2026-05-20", priority: "Normal", status: "Reported", result: "7.8% (Controlled)", cost: 180 },
  { id: "l2", reqNumber: "LAB-2026-0202", patientName: "Dawit Mekonnen", mrn: "MRN-00126", testName: "Troponin I", category: "Cardiac Markers", requestedBy: "Dr. Hiwot Haile", date: "2026-05-25", priority: "STAT", status: "Reported", result: "0.18 ng/mL (Elevated)", cost: 450 },
  { id: "l3", reqNumber: "LAB-2026-0203", patientName: "Selam Tadesse", mrn: "MRN-00125", testName: "Lipid Profile", category: "Biochemistry", requestedBy: "Dr. Yonas Bekele", date: "2026-05-22", priority: "Normal", status: "Result Ready", result: "LDL 142 mg/dL", cost: 220 },
  { id: "l4", reqNumber: "LAB-2026-0204", patientName: "Solomon Kebede", mrn: "MRN-00130", testName: "ABG (Arterial Blood Gas)", category: "Point-of-Care", requestedBy: "Dr. Hiwot Haile", date: "2026-05-26", priority: "STAT", status: "Processing", cost: 350 },
  { id: "l5", reqNumber: "LAB-2026-0205", patientName: "Bereket Assefa", mrn: "MRN-00132", testName: "CBC + Peripheral Smear", category: "Hematology", requestedBy: "Dr. Yonas Bekele", date: "2026-05-25", priority: "Urgent", status: "Result Ready", result: "WBC 14.2 (Pending pathologist review)", cost: 280 },
  { id: "l6", reqNumber: "LAB-2026-0206", patientName: "Sara Mulugeta", mrn: "MRN-00135", testName: "Creatinine + eGFR", category: "Renal Function", requestedBy: "Dr. Tigist Alemu", date: "2026-05-26", priority: "Normal", status: "Sample Collected", cost: 160 },
  { id: "l7", reqNumber: "LAB-2026-0207", patientName: "Liya Girma", mrn: "MRN-00131", testName: "TSH + Free T4", category: "Endocrinology", requestedBy: "Dr. Biruk Desta", date: "2026-05-21", priority: "Normal", status: "Reported", result: "TSH 8.4 mIU/L (High)", cost: 320 },
  { id: "l8", reqNumber: "LAB-2026-0208", patientName: "Hanna Lemma", mrn: "MRN-00129", testName: "Peak Flow / Spirometry", category: "Pulmonology", requestedBy: "Dr. Biruk Desta", date: "2026-05-23", priority: "Normal", status: "Reported", result: "FEV1/FVC: 0.71 (Mild obstruction)", cost: 200 },
  { id: "l9", reqNumber: "LAB-2026-0209", patientName: "Meron Hailu", mrn: "MRN-00127", testName: "Urine R/E + Culture", category: "Microbiology", requestedBy: "Dr. Tigist Alemu", date: "2026-05-26", priority: "Normal", status: "Processing", cost: 140 },
  { id: "l10", reqNumber: "LAB-2026-0210", patientName: "Almaz Tesfaye", mrn: "MRN-00133", testName: "X-Ray Left Knee", category: "Radiology", requestedBy: "Dr. Hiwot Haile", date: "2026-05-24", priority: "Normal", status: "Reported", result: "Moderate joint space narrowing", cost: 250 },
  { id: "l11", reqNumber: "LAB-2026-0211", patientName: "Dawit Mekonnen", mrn: "MRN-00126", testName: "Echocardiogram", category: "Cardiology", requestedBy: "Dr. Hiwot Haile", date: "2026-05-26", priority: "Urgent", status: "Pending", cost: 800 },
  { id: "l12", reqNumber: "LAB-2026-0212", patientName: "Abebe Girma", mrn: "MRN-00124", testName: "Fasting Blood Sugar", category: "Biochemistry", requestedBy: "Dr. Tigist Alemu", date: "2026-05-26", priority: "Normal", status: "Pending", cost: 80 },
];

// ─── Mock Bills ──────────────────────────────────────────────────────────────

export const mockBills: HealthBill[] = [
  { id: "b1", billNumber: "BILL-2026-0441", patientName: "Abebe Girma", mrn: "MRN-00124", date: "2026-05-20", services: ["Consultation", "Lab (HbA1c)", "Medication"], totalAmount: 820, paidAmount: 820, paymentMethod: "Telebirr", status: "Paid" },
  { id: "b2", billNumber: "BILL-2026-0442", patientName: "Selam Tadesse", mrn: "MRN-00125", date: "2026-05-22", services: ["Consultation", "Lab (Lipid Panel)", "Medication"], totalAmount: 680, paidAmount: 300, paymentMethod: "Cash", status: "Partial" },
  { id: "b3", billNumber: "BILL-2026-0443", patientName: "Dawit Mekonnen", mrn: "MRN-00126", date: "2026-05-25", services: ["ICU Admission (Day 1)", "Cardiac Monitoring", "Lab (Troponin)", "Ceftriaxone IV"], totalAmount: 4200, paidAmount: 0, status: "Insurance", insuranceProvider: "Ethio-Life Health" },
  { id: "b4", billNumber: "BILL-2026-0444", patientName: "Meron Hailu", mrn: "MRN-00127", date: "2026-05-18", services: ["OB/GYN Consultation", "Ultrasound", "Lab (Urine)"], totalAmount: 580, paidAmount: 580, paymentMethod: "CBE Birr", status: "Paid" },
  { id: "b5", billNumber: "BILL-2026-0445", patientName: "Hanna Lemma", mrn: "MRN-00129", date: "2026-05-23", services: ["Consultation", "Spirometry", "Salbutamol Inhaler"], totalAmount: 470, paidAmount: 0, status: "Pending" },
  { id: "b6", billNumber: "BILL-2026-0446", patientName: "Liya Girma", mrn: "MRN-00131", date: "2026-05-21", services: ["Consultation", "Lab (TSH/T4)", "Medication"], totalAmount: 720, paidAmount: 720, paymentMethod: "Cash", status: "Paid" },
  { id: "b7", billNumber: "BILL-2026-0447", patientName: "Solomon Kebede", mrn: "MRN-00130", date: "2026-05-26", services: ["Emergency Admission", "ABG", "Nebulization x3", "Hydrocortisone IV"], totalAmount: 2800, paidAmount: 0, status: "Insurance", insuranceProvider: "CBE Health Insurance" },
  { id: "b8", billNumber: "BILL-2026-0448", patientName: "Almaz Tesfaye", mrn: "MRN-00133", date: "2026-05-24", services: ["Consultation", "X-Ray Knee", "Medication"], totalAmount: 530, paidAmount: 200, paymentMethod: "Cash", status: "Partial" },
  { id: "b9", billNumber: "BILL-2026-0449", patientName: "Bereket Assefa", mrn: "MRN-00132", date: "2026-05-19", services: ["Oncology Consultation", "CBC", "Blood Smear"], totalAmount: 940, paidAmount: 940, paymentMethod: "Bank Transfer", status: "Paid" },
  { id: "b10", billNumber: "BILL-2026-0450", patientName: "Sara Mulugeta", mrn: "MRN-00135", date: "2026-05-26", services: ["Nephrology Consultation", "Renal Function Panel"], totalAmount: 460, paidAmount: 0, status: "Pending" },
];

// ─── Computed Stats ──────────────────────────────────────────────────────────

export function getDrugStatus(drug: Drug): DrugStatus {
  if (drug.stock === 0) return "Out of Stock";
  if (drug.stock <= drug.reorderLevel) return "Low Stock";
  const daysToExpiry = Math.ceil((new Date(drug.expiryDate).getTime() - Date.now()) / 86400000);
  if (daysToExpiry <= 60) return "Expiring Soon";
  return "In Stock";
}

export const STATUS_COLORS: Record<string, string> = {
  Active: "#10b981",
  Critical: "#ef4444",
  Discharged: "#64748b",
  Referred: "#f59e0b",
  Scheduled: "#2563eb",
  Confirmed: "#10b981",
  "In Progress": "#f59e0b",
  Completed: "#64748b",
  "No-Show": "#ef4444",
  Cancelled: "#64748b",
  "In Stock": "#10b981",
  "Low Stock": "#f59e0b",
  "Out of Stock": "#ef4444",
  "Expiring Soon": "#f97316",
  Dispensed: "#64748b",
  Expired: "#ef4444",
  Pending: "#f59e0b",
  "Sample Collected": "#2563eb",
  Processing: "#8b5cf6",
  "Result Ready": "#10b981",
  Reported: "#64748b",
  Normal: "#64748b",
  Urgent: "#f97316",
  STAT: "#ef4444",
  Paid: "#10b981",
  Partial: "#f59e0b",
  Insurance: "#2563eb",
  Waived: "#64748b",
};
