import type { SectorConfig } from "../types";
import { Students, Attendance, Grades, Timetable, Fees, Exams } from "./modules";

export const educationConfig: SectorConfig = {
  sectorId: "education",
  navItems: [
    { key: "students", label: "Students", icon: "fa-solid fa-user-graduate" },
    { key: "attendance", label: "Attendance", icon: "fa-solid fa-clipboard-user" },
    { key: "grades", label: "Grade Books", icon: "fa-solid fa-clipboard-check" },
    { key: "timetable", label: "Timetable", icon: "fa-solid fa-calendar-days" },
    { key: "fees", label: "Fees", icon: "fa-solid fa-money-check" },
    { key: "exams", label: "Exams", icon: "fa-solid fa-certificate" }
  ],
  modules: {
    students: Students,
    attendance: Attendance,
    grades: Grades,
    timetable: Timetable,
    fees: Fees,
    exams: Exams
  }
};
