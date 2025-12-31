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

    const existingLink = await LinkModel.findOne({
      longUrl: passedBody.data.longUrl,
      userId,
    });

    if (existingLink) {
      return c.json(
        {
          message: "Link already exists",
          shortUrl: `${env.BASE_URL}/${existingLink.slug}`,
          longUrl: existingLink.longUrl,
        },
        200
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
        shortUrl: `${env.BASE_URL}/${doc.slug}`,
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

  async listUserLinks(c: Context) {
    const userId = c.get("userId");
    if (!userId) return c.json({ message: "Unauthorized" }, 401);

    const links = await LinkModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    const formattedLinks = links.map((link) => ({
      id: link._id.toString(),
      slug: link.slug,
      longUrl: link.longUrl,
      shortUrl: `${env.BASE_URL}/${link.slug}`,
      createdAt:
        link.createdAt instanceof Date
          ? link.createdAt.toISOString()
          : new Date(link.createdAt).toISOString(),
      updatedAt:
        link.updatedAt instanceof Date
          ? link.updatedAt.toISOString()
          : new Date(link.updatedAt).toISOString(),
      isActive: link.isActive,
    }));

    return c.json({ links: formattedLinks }, 200);
  }
}
