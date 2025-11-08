import { z } from "zod";

export const serviceOrderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  email: z.string().email(),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"]),
  createdDate: z.string(),
  serviceType: z.string(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  estimatedCompletion: z.string(),
  budget: z.number(),
  notes: z.string().optional(),
  formData: z.object({
    projectDescription: z.string(),
    requirements: z.string(),
    deliverables: z.string(),
    timeline: z.string(),
    additionalNotes: z.string().optional(),
  }),
  metadata: z.object({
    assignedTo: z.string().optional(),
    department: z.string(),
    tags: z.array(z.string()),
    lastUpdated: z.string(),
  }),
});

export type ServiceOrder = z.infer<typeof serviceOrderSchema>;

