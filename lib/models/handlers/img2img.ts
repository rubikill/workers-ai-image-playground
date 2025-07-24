import { BaseModelHandler } from "./base";
import { ModelSchema } from "../types";

export class ImageToImageHandler extends BaseModelHandler {
  readonly modelId = "@cf/runwayml/stable-diffusion-v1-5-img2img";
  readonly modelName = "Stable Diffusion v1.5 (Image-to-Image)";

  getSchema(): ModelSchema {
    return {
      input: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            minLength: 1,
            description: "A text description of the image you want to generate",
          },
          negative_prompt: {
            type: "string",
            description:
              "Text describing elements to avoid in the generated image",
          },
          height: {
            type: "integer",
            minimum: 256,
            maximum: 2048,
            description: "The height of the generated image in pixels",
          },
          width: {
            type: "integer",
            minimum: 256,
            maximum: 2048,
            description: "The width of the generated image in pixels",
          },
          image: {
            type: "array",
            description:
              "For use with img2img tasks. An array of integers that represent the image data constrained to 8-bit unsigned integer values",
            items: {
              type: "number",
              description: "A value between 0 and 255",
            },
          },
          image_b64: {
            type: "string",
            description:
              "For use with img2img tasks. A base64-encoded string of the input image",
          },
          mask: {
            type: "array",
            description:
              "An array representing An array of integers that represent mask image data for inpainting constrained to 8-bit unsigned integer values",
            items: {
              type: "number",
              description: "A value between 0 and 255",
            },
          },
          num_steps: {
            type: "integer",
            default: 20,
            maximum: 20,
            description:
              "The number of diffusion steps; higher values can improve quality but take longer",
          },
          strength: {
            type: "number",
            default: 1,
            description:
              "A value between 0 and 1 indicating how strongly to apply the transformation during img2img tasks; lower values make the output closer to the input image",
          },
          guidance: {
            type: "number",
            default: 7.5,
            description:
              "Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt",
          },
          seed: {
            type: "integer",
            description:
              "Random seed for reproducibility of the image generation",
          },
        },
        required: ["prompt", "image_b64"],
      },
      output: {
        type: "string",
        contentType: "image/png",
        format: "binary",
        description: "The generated image in PNG format",
      },
    };
  }

  async processResponse(response: any): Promise<Uint8Array | null> {
    try {
      console.log("Img2Img response type:", typeof response, response);

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

      // Handle direct Uint8Array
      if (response && response instanceof Uint8Array) {
        return response;
      }

      // Handle string response (base64)
      if (response && typeof response === "string") {
        const binaryString = atob(response);
        return Uint8Array.from(binaryString, (m) => m.codePointAt(0)!);
      }

      // Handle JSON response with base64 image (fallback)
      if (response && response.image && typeof response.image === "string") {
        const binaryString = atob(response.image);
        return Uint8Array.from(binaryString, (m) => m.codePointAt(0)!);
      }

      console.error("Unsupported response format:", response);
      return null;
    } catch (error) {
      console.error("Error processing image-to-image response:", error);
      return null;
    }
  }

  // Override validateInput to add image-specific validation
  validateInput(input: any): any {
    const baseValidation = super.validateInput(input);

    if (!baseValidation.isValid) {
      return baseValidation;
    }

    // Additional validation for image-to-image models
    const errors: string[] = [];

    // Check if image_b64 is provided and is valid base64
    if (!input.image_b64 || typeof input.image_b64 !== "string") {
      errors.push("image_b64 is required and must be a base64 string");
    } else {
      try {
        // Validate base64 format
        atob(input.image_b64);
      } catch {
        errors.push("image_b64 must be a valid base64 string");
      }
    }

    // Validate strength parameter if provided
    if (input.strength !== undefined) {
      const strength = Number(input.strength);
      if (isNaN(strength) || strength < 0 || strength > 1) {
        errors.push("strength must be a number between 0 and 1");
      }
    }

    // Validate guidance parameter if provided
    if (input.guidance !== undefined) {
      const guidance = Number(input.guidance);
      if (isNaN(guidance) || guidance < 0) {
        errors.push("guidance must be a positive number");
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: baseValidation.warnings,
    };
  }
}
