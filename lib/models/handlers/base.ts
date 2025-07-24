import {
  ModelHandler,
  ValidationResult,
  ProcessResult,
  RequestContext,
  ModelSchema,
} from "../types";

// Abstract base class for all model handlers
export abstract class BaseModelHandler implements ModelHandler {
  abstract readonly modelId: string;
  abstract readonly modelName: string;

  // Validate input against model schema
  validateInput(input: any): ValidationResult {
    const schema = this.getSchema();
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    for (const requiredField of schema.input.required) {
      if (!input[requiredField] || input[requiredField] === "") {
        errors.push(`Missing required field: ${requiredField}`);
      }
    }

    // Validate field types and constraints
    for (const [fieldName, fieldValue] of Object.entries(input)) {
      const fieldSchema = schema.input.properties[fieldName];
      if (!fieldSchema) {
        warnings.push(`Unknown field: ${fieldName}`);
        continue;
      }

      // Type validation
      if (fieldValue !== undefined && fieldValue !== null) {
        const typeError = this.validateFieldType(
          fieldName,
          fieldValue,
          fieldSchema
        );
        if (typeError) {
          errors.push(typeError);
        }

        // Range validation for numbers
        if (fieldSchema.type === "integer" || fieldSchema.type === "number") {
          const rangeError = this.validateNumberRange(
            fieldName,
            Number(fieldValue),
            fieldSchema
          );
          if (rangeError) {
            errors.push(rangeError);
          }
        }

        // Length validation for strings
        if (fieldSchema.type === "string") {
          const lengthError = this.validateStringLength(
            fieldName,
            String(fieldValue),
            fieldSchema
          );
          if (lengthError) {
            errors.push(lengthError);
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  // Process the request with AI model
  async processRequest(
    input: any,
    context: RequestContext
  ): Promise<ProcessResult> {
    // Validate input first
    const validation = this.validateInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors?.join(", ")}`,
      };
    }

    // Call AI model
    const response = await context.env.AI.run(this.modelId, input, {
      gateway: {
        id: context.env.AI_GATEWAY_ID,
        skipCache: true,
      },
    });

    console.log("response: ", response);

    // Process response based on model type
    const imageData = await this.processResponse(response);

    if (!imageData) {
      return {
        success: false,
        error: "Failed to process AI model response",
      };
    }

    return {
      success: true,
      data: {
        imageData,
        metadata: {
          model: this.modelId,
          prompt: input.prompt,
          ...input,
        },
      },
    };
  }

  // Get default input values based on schema
  getDefaultInput(): Record<string, any> {
    const schema = this.getSchema();
    const defaults: Record<string, any> = {};

    for (const [fieldName, fieldSchema] of Object.entries(
      schema.input.properties
    )) {
      if (fieldSchema.default !== undefined) {
        defaults[fieldName] = fieldSchema.default;
      }
    }

    return defaults;
  }

  // Abstract methods that must be implemented by subclasses
  abstract getSchema(): ModelSchema;
  abstract processResponse(response: any): Promise<Uint8Array | null>;

  // Helper methods for validation
  private validateFieldType(
    fieldName: string,
    value: any,
    schema: any
  ): string | null {
    switch (schema.type) {
      case "string":
        if (typeof value !== "string") {
          return `${fieldName} must be a string`;
        }
        break;
      case "integer":
        if (!Number.isInteger(Number(value))) {
          return `${fieldName} must be an integer`;
        }
        break;
      case "number":
        if (typeof value !== "number" && isNaN(Number(value))) {
          return `${fieldName} must be a number`;
        }
        break;
      case "array":
        if (!Array.isArray(value)) {
          return `${fieldName} must be an array`;
        }
        break;
    }
    return null;
  }

  private validateNumberRange(
    fieldName: string,
    value: number,
    schema: any
  ): string | null {
    const numValue = Number(value);

    if (schema.minimum !== undefined && numValue < schema.minimum) {
      return `${fieldName} must be at least ${schema.minimum}`;
    }

    if (schema.maximum !== undefined && numValue > schema.maximum) {
      return `${fieldName} must be at most ${schema.maximum}`;
    }

    return null;
  }

  private validateStringLength(
    fieldName: string,
    value: string,
    schema: any
  ): string | null {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      return `${fieldName} must be at least ${schema.minLength} characters`;
    }

    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      return `${fieldName} must be at most ${schema.maxLength} characters`;
    }

    return null;
  }
}
