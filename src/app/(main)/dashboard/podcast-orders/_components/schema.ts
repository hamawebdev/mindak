import { z } from "zod";

export const podcastOrderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  email: z.string().email(),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
  createdDate: z.string(),
  podcastTitle: z.string(),
  episodeCount: z.number(),
  duration: z.string(),
  category: z.string(),
  budget: z.number(),
  deliveryDate: z.string(),
  notes: z.string().optional(),
  formData: z.object({
    targetAudience: z.string(),
    tone: z.string(),
    format: z.string(),
    additionalRequirements: z.string().optional(),
  }),
});

export type PodcastOrder = z.infer<typeof podcastOrderSchema>;

