import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { adminProcedure } from "../middleware/auth";
import { db } from "../database";
import { media } from "../database/schema";
import { ORPCError } from "@orpc/server";
export const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});
export const upload = {
  presign: adminProcedure
    .input(
      z.object({
        type: z.enum(["image/jpeg", "image/png", "image/webp"]),
        size: z
          .number()
          .int()
          .min(1)
          .max(8 * 1024 * 1024),
      }),
    )
    .handler(async ({ input }) => {
      const key = "media/" + crypto.randomUUID() + "." + input.type.split("/")[1];
      return {
        key,
        url: await getSignedUrl(
          s3,
          new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentType: input.type,
            ContentLength: input.size,
          }),
          { expiresIn: 300 },
        ),
      };
    }),
  complete: adminProcedure
    .input(
      z.object({
        key: z.string().regex(/^media\/[a-f0-9-]+\.(jpeg|png|webp)$/),
        name: z.string().max(200),
        alt: z.string().max(300),
        altAr: z.string().max(300),
      }),
    )
    .handler(async ({ input }) => {
      const info = await s3.send(
        new HeadObjectCommand({ Bucket: process.env.S3_BUCKET, Key: input.key }),
      );
      if (
        (info.ContentLength || 0) > 8 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "image/webp"].includes(info.ContentType || "")
      )
        throw new ORPCError("BAD_REQUEST");
      const sample = await s3.send(
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: input.key,
          Range: "bytes=0-11",
        }),
      );
      const bytes = await sample.Body!.transformToByteArray();
      const ascii = String.fromCharCode(...bytes);
      const valid =
        info.ContentType === "image/jpeg"
          ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
          : info.ContentType === "image/png"
            ? bytes[0] === 137 && ascii.slice(1, 4) === "PNG"
            : ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
      if (!valid)
        throw new ORPCError("BAD_REQUEST", {
          message: "The uploaded file is not a valid supported image.",
        });
      const url = "/api/media/" + input.key;
      await db.insert(media).values({
        id: input.key.replaceAll("/", "-").replaceAll(".", "-"),
        name: input.name,
        url,
        alt: input.alt,
        altAr: input.altAr,
      });
      return { url };
    }),
};
