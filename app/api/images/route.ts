import { getRequestContext } from "@cloudflare/next-on-pages";
import { requireAuth } from "@/lib/api-auth";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = requireAuth(request);
    const user = authenticatedRequest.user;

    const context = getRequestContext();
    const { BUCKET, PUBLIC_R2_URL } = context.env;

    // Get pagination parameters from URL
    const url = new URL(request.url);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "50");
    const cursor = url.searchParams.get("cursor") || undefined;

    // List user's images with pagination
    const options = {
      limit: pageSize,
      prefix: `${user.email}/`,
      cursor: cursor,
    };

    const listed = await BUCKET.list(options);

    // Get metadata for each image
    const images = await Promise.all(
      listed.objects.map(async (object) => {
        try {
          const metadata = await BUCKET.head(object.key);
          return {
            key: object.key,
            size: object.size,
            uploaded: object.uploaded,
            metadata: metadata?.customMetadata || {},
            publicURL: `${PUBLIC_R2_URL}/${object.key}`,
          };
        } catch (error) {
          // If metadata fetch fails, return basic info
          return {
            key: object.key,
            size: object.size,
            uploaded: object.uploaded,
            metadata: {},
            publicURL: `${PUBLIC_R2_URL}/${object.key}`,
          };
        }
      })
    );

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
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}
