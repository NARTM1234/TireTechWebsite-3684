import type { Context } from "hono";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./routes/upload";
export async function mediaHandler(c: Context) {
  const key = c.req.param("key");
  if (!/^[a-f0-9-]+\.(jpeg|png|webp)$/.test(key)) return c.json({ error: "Not found" }, 404);
  try {
    const object = await s3.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: "media/" + key }),
    );
    return new Response(object.Body?.transformToWebStream(), {
      status: 200,
      headers: {
        "Content-Type": object.ContentType || "image/webp",
        "Cache-Control": "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
}
