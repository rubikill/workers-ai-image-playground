import type { NextRequest } from "next/server";
import { ValidationStep, ValidationResult } from "../models/types";
import { modelHandlerFactory } from "../models/factory";

export class SchemaValidator implements ValidationStep {
  validate(request: NextRequest, context: any): ValidationResult {
    try {
      // Check if request has a body (basic structure validation)
      if (!request.body) {
        return {
          isValid: false,
          errors: ["Request body is required"],
        };
      }

      // Validate content type
      const contentType = request.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        return {
          isValid: false,
          errors: ["Content-Type must be application/json"],
        };
      }

      // Note: We can't read the body here as it's already consumed by the route
      // The actual schema validation will be done in the model handler
      // This validator ensures the request has the basic structure needed

      // We can validate that the model parameter is supported (if available in context)
      if (context.parsedBody && context.parsedBody.model) {
        const modelId = context.parsedBody.model;
        if (!modelHandlerFactory.isSupported(modelId)) {
          return {
            isValid: false,
            errors: [`Unsupported model: ${modelId}`],
          };
        }
      }

      return {
        ...context,
        isValid: true,
      };
    } catch (error: any) {
      return {
        isValid: false,
        errors: [`Schema validation error: ${error.message}`],
      };
    }
  }
}
