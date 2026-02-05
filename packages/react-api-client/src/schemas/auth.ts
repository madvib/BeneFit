import { z } from 'zod';

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

export const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(1, 'First name is required'),
    surname: z.string().min(1, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const PasswordResetSchema = z.object({
  email: z.email('Invalid email address'),
});

export const UpdatePasswordSchema = z
  .object({
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'First name is required'),
  surname: z.string().min(1, 'Last name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type PasswordResetFormData = z.infer<typeof PasswordResetSchema>;
export type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type PersonalInfoFormData = z.infer<typeof PersonalInfoSchema>;