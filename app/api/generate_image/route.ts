// Refactored route using design patterns for better maintainability and extensibility

import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { modelHandlerFactory } from "@/lib/models/factory";
import { R2Storage } from "@/lib/storage/r2";
import { ValidationChain } from "@/lib/validation/chain";
import { GenerateImageResponse, ErrorResponse } from "@/lib/models/types";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    // Get Cloudflare context
    const context = getRequestContext();
    const { AI, BUCKET, AI_GATEWAY_ID, PUBLIC_R2_URL } = context.env;

    // Parse request body first
    const requestBody = (await request.json()) as any;
    const { model = "@cf/black-forest-labs/flux-1-schnell", ...input } =
      requestBody;

    // Initialize validation chain
    const validationChain = new ValidationChain();

    // Create validation context with parsed body
    const validationContext = { parsedBody: requestBody };

    // Validate authentication and basic request structure
    const validationResult = await validationChain.validate(
      request,
      validationContext
    );

    // console.log("validationResult: ", validationResult);

    if (!validationResult.isValid) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.errors?.join(", "),
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get user from authentication (stored in validation context)
    const user = validationResult.user;
    if (!user) {
      return new Response(
        JSON.stringify({
          error: "Authentication required",
        } as ErrorResponse),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Create model handler
    let handler;
    try {
      handler = modelHandlerFactory.createHandler(model);
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          error: "Unsupported model",
          details: error.message,
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Process request with model handler
    const processResult = await handler.processRequest(input, {
      ...context,
      user,
    });

    console.log("processResult: ", processResult);

    if (!processResult.success) {
      return new Response(
        JSON.stringify({
          error: "Image generation failed",
          details: processResult.error,
        } as ErrorResponse),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Store image in R2
    const storage = new R2Storage(BUCKET, PUBLIC_R2_URL);
    const storageResult = await storage.storeImage(
      processResult.data!.imageData,
      user.email,
      {
        model,
        generatedAt: Date.now(),
        prompt: input.prompt,
      }
    );

    if (!storageResult.success) {
      return new Response(
        JSON.stringify({
          error: "Storage failed",
          details: storageResult.error,
        } as ErrorResponse),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return success response
    const response: GenerateImageResponse = {
      url: storageResult.url!,
      metadata: {
        model,
        generatedAt: Date.now(),
        userEmail: user.email,
        prompt: input.prompt,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    console.error("Route error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      } as ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
