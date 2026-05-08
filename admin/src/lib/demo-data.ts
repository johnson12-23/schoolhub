import type { Announcement, Message, Payment, SchoolClass, Student, Subject, Teacher } from "@/types/admin";

export const overviewStats = [
  { label: "Total Students", value: "1,248", delta: "+8.2%", tone: "blue" },
  { label: "Total Teachers", value: "84", delta: "+3 this term", tone: "mint" },
  { label: "Total Classes", value: "36", delta: "12 streams", tone: "gold" },
  { label: "Attendance", value: "94%", delta: "+2.4%", tone: "blue" },
  { label: "Pending Fees", value: "GHS 42k", delta: "-12%", tone: "gold" },
  { label: "New Messages", value: "18", delta: "6 urgent", tone: "mint" },
  { label: "Upcoming Events", value: "7", delta: "This month", tone: "blue" }
];

export const attendanceChart = [
  { month: "Jan", present: 91, absent: 5, late: 4 },
  { month: "Feb", present: 93, absent: 4, late: 3 },
  { month: "Mar", present: 90, absent: 6, late: 4 },
  { month: "Apr", present: 95, absent: 3, late: 2 },
  { month: "May", present: 94, absent: 4, late: 2 },
  { month: "Jun", present: 96, absent: 2, late: 2 }
];

export const performanceChart = [
  { subject: "Math", score: 82 },
  { subject: "English", score: 78 },
  { subject: "Science", score: 86 },
  { subject: "ICT", score: 91 },
  { subject: "Social", score: 74 }
];

export const classes: SchoolClass[] = [
  { id: "cls-1", name: "JHS 1 Blue", level: "JHS 1", class_teacher_name: "Mrs. Ama Owusu", student_count: 42 },
  { id: "cls-2", name: "JHS 2 Gold", level: "JHS 2", class_teacher_name: "Mr. Kojo Mensah", student_count: 38 },
  { id: "cls-3", name: "JHS 3 Green", level: "JHS 3", class_teacher_name: "Ms. Efua Addo", student_count: 45 }
];

export const students: Student[] = [
  {
    id: "stu-1",
    full_name: "Nana Yaw Asare",
    gender: "Male",
    date_of_birth: "2011-04-12",
    class_id: "cls-3",
    class_name: "JHS 3 Green",
    email: "nana.asare@example.com",
    phone: "+233 24 000 1010",
    address: "East Legon, Accra",
    guardian_name: "Kwesi Asare",
    guardian_phone: "+233 24 111 2020",
    guardian_email: "kwesi.asare@example.com",
    admission_number: "SH-JHS3-2026-0001",
    created_at: "2026-05-06T09:30:00Z"
  },
  {
    id: "stu-2",
    full_name: "Akua Serwaa Boateng",
    gender: "Female",
    date_of_birth: "2012-08-21",
    class_id: "cls-2",
    class_name: "JHS 2 Gold",
    email: "akua.boateng@example.com",
    phone: "+233 55 020 3333",
    address: "Adenta, Accra",
    guardian_name: "Ama Boateng",
    guardian_phone: "+233 20 222 3030",
    guardian_email: "ama.boateng@example.com",
    admission_number: "SH-JHS2-2026-0002",
    created_at: "2026-05-05T11:10:00Z"
  }
];

export const teachers: Teacher[] = [
  {
    id: "tea-1",
    full_name: "Mrs. Ama Owusu",
    email: "ama.owusu@schoolhub.edu",
    phone: "+233 27 400 2020",
    subjects: ["Mathematics", "Science"],
    classes: ["JHS 1 Blue", "JHS 3 Green"],
    salary_status: "paid",
    attendance_rate: 98
  },
  {
    id: "tea-2",
    full_name: "Mr. Kojo Mensah",
    email: "kojo.mensah@schoolhub.edu",
    phone: "+233 24 500 2020",
    subjects: ["English", "Social Studies"],
    classes: ["JHS 2 Gold"],
    salary_status: "pending",
    attendance_rate: 94
  }
];

export const subjects: Subject[] = [
  { id: "sub-1", name: "Mathematics", code: "MATH", teacher_name: "Mrs. Ama Owusu" },
  { id: "sub-2", name: "English Language", code: "ENG", teacher_name: "Mr. Kojo Mensah" },
  { id: "sub-3", name: "Integrated Science", code: "SCI", teacher_name: "Mrs. Ama Owusu" }
];

export const payments: Payment[] = [
  { id: "pay-1", student_name: "Nana Yaw Asare", amount: 2400, balance: 0, status: "paid", reference: "PSK-845020" },
  { id: "pay-2", student_name: "Akua Serwaa Boateng", amount: 2400, balance: 900, status: "partial", reference: "PSK-845021" },
  { id: "pay-3", student_name: "Yaw Frimpong", amount: 2400, balance: 2400, status: "overdue", reference: "PSK-845022" }
];

export const announcements: Announcement[] = [
  {
    id: "ann-1",
    title: "End of term exams begin Monday",
    body: "All students should check their timetable and report by 7:30 AM.",
    audience: "Students and Parents",
    pinned: true,
    created_at: "2026-05-07T08:00:00Z"
  },
  {
    id: "ann-2",
    title: "PTA meeting reminder",
    body: "The next PTA meeting will be held in the assembly hall.",
    audience: "Parents",
    pinned: false,
    scheduled_at: "2026-05-15T10:00:00Z",
    created_at: "2026-05-06T08:00:00Z"
  }
];

export const messages: Message[] = [
  {
    id: "msg-1",
    name: "Esi Dadzie",
    email: "esi.dadzie@example.com",
    subject: "Admission enquiry",
    body: "Please share the admission requirements for JHS 1.",
    status: "unread",
    created_at: "2026-05-08T09:00:00Z"
  },
  {
    id: "msg-2",
    name: "Kofi Annan",
    email: "kofi.annan@example.com",
    subject: "Payment confirmation",
    body: "I paid through Paystack but cannot see my receipt.",
    status: "read",
    created_at: "2026-05-07T16:20:00Z"
  }
];

export const activityFeed = [
  "Akua Serwaa Boateng completed registration.",
  "Mrs. Ama Owusu uploaded JHS 3 Mathematics results.",
  "Accountant marked 12 invoices as paid.",
  "Moderator pinned exam timetable announcement."
];
