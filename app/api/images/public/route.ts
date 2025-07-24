import { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const context = getRequestContext();
    const { BUCKET, PUBLIC_R2_URL } = context.env;

    // Get pagination parameters from URL
    const url = new URL(request.url);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "50");
    const cursor = url.searchParams.get("cursor") || undefined;

    // List all objects in the bucket with pagination
    const options = {
      limit: pageSize,
      cursor: cursor,
    };

    const listed = await BUCKET.list(options);

    // Filter for image files and extract metadata
    const images = await Promise.all(
      listed.objects
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
              publicURL: `${PUBLIC_R2_URL}/${obj.key}`,
            };
          } catch (error) {
            console.error(`Error getting metadata for ${obj.key}:`, error);
            return {
              key: obj.key,
              uploaded: obj.uploaded.toISOString(),
              metadata: {},
              publicURL: `${PUBLIC_R2_URL}/${obj.key}`,
            };
          }
        })
    );

    // Sort by upload date (newest first)
    // images.sort(
    //   (a, b) => new Date(b.uploaded).getTime() - new Date(a.uploaded).getTime()
    // );

    // Return paginated response
    const response = {
      images,
      pagination: {
        hasMore: listed.truncated,
        nextCursor: listed.truncated ? listed.cursor : undefined,
        pageSize,
        currentPage: cursor ? 2 : 1, // Simple page tracking
      },
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Error listing public images:", error);
    return new Response(error.message, { status: 500 });
  }
}
