import { z } from "zod";

export const createShortLinkSchema = z.object({
  longUrl: z.url().max(2048),
});

export const createShortLinkSchemaOutput = z.object({
  shortUrl: z.url(),
  longUrl: z.url(),
});

export const redirectParamsSchema = z.object({
  slug: z.string(),
});

export const linkNotFoundSchema = z.object({
  message: z.string(),
});

export const linkItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  longUrl: z.url(),
  shortUrl: z.url(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean(),
});

export const meLinksSchemaOutput = z.object({
  links: z.array(linkItemSchema),
});

export type CreateShortLinkInput = z.infer<typeof createShortLinkSchema>;
export type CreateShortLinkOutput = z.infer<typeof createShortLinkSchemaOutput>;
export type RedirectParams = z.infer<typeof redirectParamsSchema>;
export type LinkNotFoundOutput = z.infer<typeof linkNotFoundSchema>;
export type MeLinksOutput = z.infer<typeof meLinksSchemaOutput>;
