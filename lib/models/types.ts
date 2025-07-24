import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { User } from "@/lib/auth";

// Request context containing environment and user information
export interface RequestContext {
  env: {
    AI: any;
    BUCKET: any;
    AI_GATEWAY_ID: string;
    PUBLIC_R2_URL: string;
  };
  user?: User;
}

// Validation result structure
export interface ValidationResult {
  isValid: boolean;
  user?: User;
  errors?: string[];
  warnings?: string[];
}

// Process result structure
export interface ProcessResult {
  success: boolean;
  data?: {
    imageData: Uint8Array;
    metadata: Record<string, any>;
  };
  error?: string;
}

// Model schema structure
export interface ModelSchema {
  input: {
    type: string;
    properties: Record<string, SchemaProperty>;
    required: string[];
  };
  output: {
    type: string;
    contentType: string;
    properties?: Record<string, any>;
    format?: string;
    description?: string;
  };
}

export interface SchemaProperty {
  type: string;
  description?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  items?: {
    type: string;
    description?: string;
  };
}

// Base model handler interface
export interface ModelHandler {
  readonly modelId: string;
  readonly modelName: string;

  validateInput(input: any): ValidationResult;
  processRequest(input: any, context: RequestContext): Promise<ProcessResult>;
  getSchema(): ModelSchema;
  getDefaultInput(): Record<string, any>;
}

// Response structure for all models
export interface GenerateImageResponse {
  url: string;
  metadata: {
    model: string;
    generatedAt: number;
    userEmail: string;
    prompt: string;
    [key: string]: any;
  };
}

// Error response structure
export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

// Model handler factory interface
export interface ModelHandlerFactory {
  createHandler(modelId: string): ModelHandler;
  getSupportedModels(): string[];
}

// Validation step interface for chain of responsibility
export interface ValidationStep {
  validate(request: NextRequest, context: any): ValidationResult;
}

// Storage operation result
export interface StorageResult {
  success: boolean;
  fileName?: string;
  url?: string;
  error?: string;
}
