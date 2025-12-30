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

export const meLinksSchemaOutput = z.object({
  message: z.string(),
});

export type CreateShortLinkInput = z.infer<typeof createShortLinkSchema>;
export type CreateShortLinkOutput = z.infer<typeof createShortLinkSchemaOutput>;
export type RedirectParams = z.infer<typeof redirectParamsSchema>;
export type LinkNotFoundOutput = z.infer<typeof linkNotFoundSchema>;
export type MeLinksOutput = z.infer<typeof meLinksSchemaOutput>;
