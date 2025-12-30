import { z } from "zod";

export const shortenSchema = z.object({
  longUrl: z.url().max(2048),
});

export type ShortenInput = z.infer<typeof shortenSchema>;
