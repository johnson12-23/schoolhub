export type AdminRole = "super_admin" | "teacher_admin" | "accountant_admin" | "moderator";
export type AttendanceStatus = "present" | "absent" | "late";
export type PaymentStatus = "paid" | "pending" | "partial" | "overdue";

export type AdminUser = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: AdminRole;
  status: "active" | "suspended";
  avatar_url?: string | null;
};

export type Student = {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  class_id: string;
  class_name?: string;
  email: string;
  phone: string;
  address: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_email: string;
  admission_number: string;
  photo_url?: string | null;
  created_at: string;
};

export type Teacher = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: string[];
  salary_status: PaymentStatus;
  attendance_rate: number;
  avatar_url?: string | null;
};

export type SchoolClass = {
  id: string;
  name: string;
  level: string;
  class_teacher_id?: string | null;
  class_teacher_name?: string | null;
  student_count: number;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  teacher_id?: string | null;
  teacher_name?: string | null;
};

export type Payment = {
  id: string;
  student_name: string;
  amount: number;
  balance: number;
  status: PaymentStatus;
  reference: string;
  paid_at?: string | null;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  status: "read" | "unread";
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: string;
  pinned: boolean;
  scheduled_at?: string | null;
  created_at: string;
};
