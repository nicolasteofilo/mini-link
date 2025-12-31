import { connectRedis } from "@/cache/redis";
import { CacheKeys } from "@/cache/keys";

const NOT_FOUND_SENTINEL = "__NOT_FOUND__";

export type LinkCacheResult =
  | { status: "hit"; longUrl: string }
  | { status: "miss" }
  | { status: "not_found" };

export async function getLinkBySlugCache(
  slug: string
): Promise<LinkCacheResult> {
  const redis = await connectRedis();
  const value = await redis.get(CacheKeys.linkBySlug(slug));

  if (!value) return { status: "miss" };
  if (value === NOT_FOUND_SENTINEL) return { status: "not_found" };
  return { status: "hit", longUrl: value };
}

export async function setLinkBySlugCache(
  slug: string,
  longUrl: string,
  ttlSeconds: number
) {
  const redis = await connectRedis();
  return redis.setEx(CacheKeys.linkBySlug(slug), ttlSeconds, longUrl);
}

export async function setLinkBySlugNotFoundCache(
  slug: string,
  ttlSeconds: number
) {
  const redis = await connectRedis();
  return redis.setEx(
    CacheKeys.linkBySlug(slug),
    ttlSeconds,
    NOT_FOUND_SENTINEL
  );
}
