// a next.js route that handles a JSON post request with prompt and model
// and calls the Cloudflare Workers AI model

import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { requireAuth } from "@/lib/api-auth";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authenticatedRequest = requireAuth(request);
    const user = authenticatedRequest.user;

    const context = getRequestContext();
    const { AI, BUCKET } = context.env;
    let { prompt, model } = await authenticatedRequest.json<{
      prompt: string;
      model: string;
    }>();
    if (!model) model = "@cf/black-forest-labs/flux-1-schnell";

    const inputs = { prompt };
    const response = await AI.run(model, inputs);

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    // Store images in user-specific folders
    const fileName = `${user.id}/${timestamp}-${randomId}.jpeg`;
    const binaryString = atob(response.image);

    // @ts-ignore
    const img = Uint8Array.from(binaryString, (m) => m.codePointAt(0));
    await BUCKET.put(fileName, img, {
      customMetadata: {
        userId: user.id,
        userEmail: user.email,
        generatedAt: timestamp.toString(),
        prompt: prompt,
        model: model,
      },
    });

    return new Response(`data:image/jpeg;base64,${response.image}`, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });
  } catch (error: any) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
}
