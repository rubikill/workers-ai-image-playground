import { ModelHandler, ModelHandlerFactory } from "./types";
import { TextToImageHandler, ImageToImageHandler } from "./handlers";

export class ModelHandlerFactoryImpl implements ModelHandlerFactory {
  private handlers = new Map<string, ModelHandler>([
    ["@cf/black-forest-labs/flux-1-schnell", new TextToImageHandler()],
    ["@cf/runwayml/stable-diffusion-v1-5-img2img", new ImageToImageHandler()],
  ]);

  createHandler(modelId: string): ModelHandler {
    const handler = this.handlers.get(modelId);

    if (!handler) {
      throw new Error(`Unsupported model: ${modelId}`);
    }

    return handler;
  }

  getSupportedModels(): string[] {
    return Array.from(this.handlers.keys());
  }

  // Helper method to check if a model is supported
  isSupported(modelId: string): boolean {
    return this.handlers.has(modelId);
  }

  // Helper method to get handler info
  getHandlerInfo(
    modelId: string
  ): { modelId: string; modelName: string } | null {
    const handler = this.handlers.get(modelId);
    if (!handler) {
      return null;
    }

    return {
      modelId: handler.modelId,
      modelName: handler.modelName,
    };
  }
}

// Export singleton instance
export const modelHandlerFactory = new ModelHandlerFactoryImpl();
