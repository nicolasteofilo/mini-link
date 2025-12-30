import { createShortLinkSchema } from "@/http/schemas/link.schema";
import { Context } from "hono";
import { z } from "zod";
import { generateSlugBase62 } from "@/lib/slug";
import { LinkModel } from "@/db/models/link";
import { env } from "@/config/env";

export class LinkController {
  async generateShortLink(c: Context) {
    const body = await c.req.json().catch(() => null);
    const passedBody = createShortLinkSchema.safeParse(body);
    const userId = c.get("userId");
    if (!userId) return c.json({ message: "Unauthorized" }, 401);

    if (!passedBody.success) {
      return c.json(
        {
          message: "Invalid request body.",
          errors: z.treeifyError(passedBody.error),
        },
        400
      );
    }

    const longUrl = passedBody.data.longUrl;
    const slug = generateSlugBase62({
      secret: env.SLUG_SECRET,
      length: 8,
      entropyBytes: 16,
    });

    try {
      const doc = await LinkModel.create({
        slug,
        longUrl,
        userId,
      });

      return c.json({
        shortUrl: `${env.BASE_URL}/api/${doc.slug}`,
        longUrl: doc.longUrl,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        return c.json({ message: "Slug already in use" }, 409);
      }
      return c.json({ message: "Internal error" }, 500);
    }
  }

  async redirectToLongUrl(c: Context) {
    const { slug } = c.req.param();

    const linkDoc = await LinkModel.findOne({ slug });

    if (!linkDoc) {
      return c.json({ message: "Link not found" }, 404);
    }

    return c.redirect(linkDoc.longUrl, 302);
  }
}
