import type { NextRequest } from "next/server";
import { ValidationStep, ValidationResult } from "../models/types";
import { AuthenticationValidator } from "./auth";
import { SchemaValidator } from "./schema";

export class ValidationChain {
  private validators: ValidationStep[];

  constructor() {
    this.validators = [new AuthenticationValidator(), new SchemaValidator()];
  }

  // Add a custom validator to the chain
  addValidator(validator: ValidationStep): void {
    this.validators.push(validator);
  }

  // Execute the validation chain
  async validate(
    request: NextRequest,
    context: any = {}
  ): Promise<ValidationResult> {
    for (const validator of this.validators) {
      const result = validator.validate(request, context);

      if (!result.isValid) {
        return {
          ...result,
          isValid: false,
        };
      }
    }

    return {
      ...context,
      isValid: true,
    };
  }

  // Get all validation errors from the chain
  async validateAll(request: NextRequest): Promise<ValidationResult> {
    const context: any = {};
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(request, context);

      if (result.errors) {
        allErrors.push(...result.errors);
      }

      if (result.warnings) {
        allWarnings.push(...result.warnings);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors.length > 0 ? allErrors : undefined,
      warnings: allWarnings.length > 0 ? allWarnings : undefined,
    };
  }
}
