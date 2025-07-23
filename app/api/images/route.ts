import { getRequestContext } from '@cloudflare/next-on-pages'
import { requireAuth } from '@/lib/api-auth'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const authenticatedRequest = requireAuth(request)
    const user = authenticatedRequest.user

    const context = getRequestContext()
    const { BUCKET } = context.env

    // List only user's images
    const options = {
      limit: 500,
      prefix: `${user.id}/`
    }

    const listed = await BUCKET.list(options);
    let truncated = listed.truncated;
    // @ts-ignore
    let cursor = truncated ? listed.cursor : undefined;

    while (truncated) {
      const next = await BUCKET.list({
        ...options,
        cursor: cursor,
      });
      listed.objects.push(...next.objects);

      truncated = next.truncated;
      // @ts-ignore
      cursor = next.cursor
    }

    // Get metadata for each image
    const images = await Promise.all(
      listed.objects.map(async (object) => {
        try {
          const metadata = await BUCKET.head(object.key)
          return {
            key: object.key,
            size: object.size,
            uploaded: object.uploaded,
            metadata: metadata?.customMetadata || {}
          }
        } catch (error) {
          // If metadata fetch fails, return basic info
          return {
            key: object.key,
            size: object.size,
            uploaded: object.uploaded,
            metadata: {}
          }
        }
      })
    )

    return new Response(JSON.stringify(images), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error: any) {
    console.log(error)
    return new Response(error.message, { status: 500 })
  }
}
