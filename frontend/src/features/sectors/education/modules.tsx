"use client";

import { ModulePage } from "../shared/ModulePage";

const COLOR = "#06b6d4";

export function Students() {
  return (
    <ModulePage
      title="Students"
      icon="fa-solid fa-user-graduate"
      color="#2563eb"
      description="Enrollment, guardians, documents, and class placement"
      stats={[
        { label: "Total Students" },
        { label: "Active" },
        { label: "New This Term" },
        { label: "Graduated" }
      ]}
      addLabel="Enroll Student"
      emptyMessage="No students enrolled yet — add your first student"
    />
  );
}

export function Attendance() {
  return (
    <ModulePage
      title="Attendance"
      icon="fa-solid fa-clipboard-user"
      color="#10b981"
      description="Daily attendance, absence notes, and trends"
      stats={[
        { label: "Present Today" },
        { label: "Absent" },
        { label: "Late" },
        { label: "Attendance Rate" }
      ]}
      addLabel="Record Attendance"
      emptyMessage="No attendance records today"
    />
  );
}

export function Grades() {
  return (
    <ModulePage
      title="Grade Books"
      icon="fa-solid fa-clipboard-check"
      color="#f59e0b"
      description="Assessments, results, terms, and transcripts"
      stats={[
        { label: "Assessments" },
        { label: "Graded" },
        { label: "Pending" },
        { label: "Class Average" }
      ]}
      addLabel="Add Assessment"
      emptyMessage="No grade records yet — create the first assessment"
    />
  );
}

export function Timetable() {
  return (
    <ModulePage
      title="Timetable"
      icon="fa-solid fa-calendar-days"
      color={COLOR}
      description="Class schedules, rooms, periods, and conflicts"
      stats={[
        { label: "Total Classes" },
        { label: "This Week" },
        { label: "Rooms Used" },
        { label: "Conflicts" }
      ]}
      addLabel="Add Period"
      emptyMessage="No timetable set up yet"
    />
  );
}

export function Fees() {
  return (
    <ModulePage
      title="Fees"
      icon="fa-solid fa-money-check"
      color="#ef4444"
      description="Billing, payment plans, discounts, and balances"
      stats={[
        { label: "Total Billed" },
        { label: "Collected" },
        { label: "Outstanding" },
        { label: "Overdue" }
      ]}
      addLabel="Create Fee"
      emptyMessage="No fee records yet"
    />
  );
}

export function Exams() {
  return (
    <ModulePage
      title="Exams"
      icon="fa-solid fa-certificate"
      color="#84cc16"
      description="Exam calendar, grading rules, and report cards"
      stats={[
        { label: "Upcoming Exams" },
        { label: "Completed" },
        { label: "Results Pending" },
        { label: "Pass Rate" }
      ]}
      addLabel="Schedule Exam"
      emptyMessage="No exams scheduled yet"
    />
  );
}
