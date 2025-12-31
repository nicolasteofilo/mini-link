import { createShortLinkSchema } from "@/http/schemas/link.schema";
import type { Request, Response } from "express";
import { z } from "zod";
import { generateSlugBase62 } from "@/lib/slug";
import { LinkModel } from "@/db/models/link";
import { env } from "@/config/env";

export class LinkController {
  async generateShortLink(req: Request, res: Response) {
    const body = req.body ?? null;
    const passedBody = createShortLinkSchema.safeParse(body);
    const userId = res.locals.userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!passedBody.success) {
      return res.status(400).json(
        {
          message: "Invalid request body.",
          errors: z.treeifyError(passedBody.error),
        }
      );
    }

    const existingLink = await LinkModel.findOne({
      longUrl: passedBody.data.longUrl,
      userId,
    });

    if (existingLink) {
      return res.status(200).json(
        {
          message: "Link already exists",
          shortUrl: `${env.BASE_URL}/${existingLink.slug}`,
          longUrl: existingLink.longUrl,
        }
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

      return res.json({
        shortUrl: `${env.BASE_URL}/${doc.slug}`,
        longUrl: doc.longUrl,
      });
    } catch (error: any) {
      if (error?.code === 11000) {
        return res.status(409).json({ message: "Slug already in use" });
      }
      return res.status(500).json({ message: "Internal error" });
    }
  }

  async redirectToLongUrl(req: Request, res: Response) {
    const { slug } = req.params;
    const linkDoc = await LinkModel.findOne({ slug });

    if (!linkDoc) {
      return res.status(404).json({ message: "Link not found" });
    }

    return res.redirect(302, linkDoc.longUrl);
  }

  async listUserLinks(req: Request, res: Response) {
    const userId = res.locals.userId as string | undefined;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

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

    return res.status(200).json({ links: formattedLinks });
  }
}
