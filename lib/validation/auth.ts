import type { NextRequest } from "next/server";
import { ValidationStep, ValidationResult } from "../models/types";
import { requireAuth } from "@/lib/api-auth";

export class AuthenticationValidator implements ValidationStep {
  validate(request: NextRequest, context: any): ValidationResult {
    try {
      // Use existing requireAuth function
      const authenticatedRequest = requireAuth(request);

      // Add user to context for downstream validators
      context.user = authenticatedRequest.user;

      return {
        ...context,
        isValid: true,
      };
    } catch (error: any) {
      return {
        isValid: false,
        errors: ["Authentication required"],
      };
    }
  }
}
