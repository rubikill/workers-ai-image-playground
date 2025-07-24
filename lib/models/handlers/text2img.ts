import { BaseModelHandler } from "./base";
import { ModelSchema } from "../types";

export class TextToImageHandler extends BaseModelHandler {
  readonly modelId = "@cf/black-forest-labs/flux-1-schnell";
  readonly modelName = "Flux 1 Schnell (Text-to-Image)";

  getSchema(): ModelSchema {
    return {
      input: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            minLength: 1,
            maxLength: 2048,
            description:
              "A text description of the image you want to generate.",
          },
          steps: {
            type: "integer",
            default: 4,
            maximum: 8,
            description:
              "The number of diffusion steps; higher values can improve quality but take longer.",
          },
        },
        required: ["prompt"],
      },
      output: {
        type: "object",
        contentType: "application/json",
        properties: {
          image: {
            type: "string",
            description: "The generated image in Base64 format.",
          },
        },
      },
    };
  }

  async processResponse(response: any): Promise<Uint8Array | null> {
    try {
      console.log("Text2Img response type:", typeof response, response);

      // Handle ReadableStream response using proper Streams API
      if (response && typeof response.getReader === "function") {
        const reader = response.getReader();
        const chunks: Uint8Array[] = [];

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
        } finally {
          reader.releaseLock();
        }

        // Combine all chunks into a single Uint8Array
        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        );
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }

        return result;
      }

      // Handle Response object with ReadableStream body
      if (
        response &&
        response.body &&
        typeof response.body.getReader === "function"
      ) {
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
        } finally {
          reader.releaseLock();
        }

        // Combine all chunks into a single Uint8Array
        const totalLength = chunks.reduce(
          (acc, chunk) => acc + chunk.length,
          0
        );
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.length;
        }

        return result;
      }

      // Handle JSON response with base64 image (fallback)
      if (response && response.image && typeof response.image === "string") {
        const binaryString = atob(response.image);
        return Uint8Array.from(binaryString, (m) => m.codePointAt(0)!);
      }

      // Handle direct Uint8Array
      if (response && response instanceof Uint8Array) {
        return response;
      }

      console.error("Unsupported response format:", response);
      return null;
    } catch (error) {
      console.error("Error processing text-to-image response:", error);
      return null;
    }
  }
}
