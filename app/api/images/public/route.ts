import { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const context = getRequestContext();
    const { BUCKET } = context.env;

    // List all objects in the bucket
    const objects = await BUCKET.list();

    // Filter for image files and extract metadata
    const images = await Promise.all(
      objects.objects
        .filter(
          (obj) =>
            obj.key.endsWith(".jpeg") ||
            obj.key.endsWith(".jpg") ||
            obj.key.endsWith(".png")
        )
        .map(async (obj) => {
          try {
            // Get metadata for each image
            const metadata = await BUCKET.head(obj.key);
            return {
              key: obj.key,
              uploaded: obj.uploaded.toISOString(),
              metadata: metadata?.customMetadata || {},
            };
          } catch (error) {
            console.error(`Error getting metadata for ${obj.key}:`, error);
            return {
              key: obj.key,
              uploaded: obj.uploaded.toISOString(),
              metadata: {},
            };
          }
        })
    );

    // Sort by upload date (newest first)
    images.sort(
      (a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime()
    );

    return new Response(JSON.stringify(images), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error listing public images:", error);
    return new Response(error.message, { status: 500 });
  }
}
