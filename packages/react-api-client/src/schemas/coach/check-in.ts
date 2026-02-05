import { z } from 'zod';

export const CheckInFormSchema = z.object({
  response: z.string().min(1, 'Response cannot be empty'),
});

export type CheckInFormValues = z.infer<typeof CheckInFormSchema>;
