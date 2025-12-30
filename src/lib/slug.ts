import crypto from "node:crypto";

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function bytesToBase62(buf: Buffer) {
  // bytes -> BigInt -> base62
  let n = BigInt("0x" + buf.toString("hex"));
  if (n === 0n) return "0";

  let out = "";
  while (n > 0n) {
    const r = Number(n % 62n);
    out = BASE62[r] + out;
    n = n / 62n;
  }
  return out;
}

export function generateSlugBase62(params: {
  secret: string;      // ex: process.env.SLUG_SECRET!
  length?: number;     // ex: 7..10
  entropyBytes?: number; // ex: 16
}) {
  const { secret, length = 8, entropyBytes = 16 } = params;

  // entropy + timestamp (only help to avoid collisions)
  const rnd = crypto.randomBytes(entropyBytes);
  const ts = Buffer.from(Date.now().toString());

  // HMAC = hash(entropy + timestamp, secret)
  const digest = crypto
    .createHmac("sha256", secret)
    .update(rnd)
    .update(ts)
    .digest(); // 32 bytes

  const base62 = bytesToBase62(digest);

  return base62.slice(0, length);
}
