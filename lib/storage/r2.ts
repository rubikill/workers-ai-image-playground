import { StorageResult, RequestContext } from "../models/types";

export class R2Storage {
  private bucket: any;
  private publicUrl: string;

  constructor(bucket: any, publicUrl: string) {
    this.bucket = bucket;
    this.publicUrl = publicUrl;
  }

  // Store image data in R2
  async storeImage(
    imageData: Uint8Array,
    userEmail: string,
    metadata: Record<string, any>
  ): Promise<StorageResult> {
    try {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `${userEmail}/${timestamp}-${randomId}.png`;

      // Store the image with metadata
      await this.bucket.put(fileName, imageData, {
        customMetadata: {
          userEmail,
          generatedAt: timestamp.toString(),
          prompt: metadata.prompt,
          model: metadata.model,
        },
      });

      const url = `${this.publicUrl}/${fileName}`;

      return {
        success: true,
        fileName,
        url,
      };
    } catch (error: any) {
      console.error("R2 storage error:", error);
      return {
        success: false,
        error: `Storage error: ${error.message}`,
      };
    }
  }

  // Get image metadata
  async getImageMetadata(
    fileName: string
  ): Promise<Record<string, any> | null> {
    try {
      const object = await this.bucket.head(fileName);
      return object.customMetadata || {};
    } catch (error) {
      console.error("Error getting image metadata:", error);
      return null;
    }
  }

  // Delete image
  async deleteImage(fileName: string): Promise<StorageResult> {
    try {
      await this.bucket.delete(fileName);
      return {
        success: true,
      };
    } catch (error: any) {
      console.error("Error deleting image:", error);
      return {
        success: false,
        error: `Delete error: ${error.message}`,
      };
    }
  }

  // List images for a user
  async listUserImages(userEmail: string): Promise<string[]> {
    try {
      const objects = await this.bucket.list({ prefix: `${userEmail}/` });
      return objects.objects.map((obj: any) => obj.key);
    } catch (error) {
      console.error("Error listing user images:", error);
      return [];
    }
  }
}
