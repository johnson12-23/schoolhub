import { z } from "zod";

export const studentSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  gender: z.string().trim().min(1).max(30),
  date_of_birth: z.string().trim().min(1),
  class_id: z.string().uuid(),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(30),
  address: z.string().trim().min(2).max(240),
  guardian_name: z.string().trim().min(2).max(120),
  guardian_phone: z.string().trim().min(6).max(30),
  guardian_email: z.string().trim().email(),
  admission_number: z.string().trim().min(3).max(60),
  photo_url: z.string().url().optional().nullable()
});
