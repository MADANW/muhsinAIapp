/**
 * Error types and interfaces for MuhsinAI
 * 
 * This file defines standardized error types used throughout the application
 * to improve type safety and error handling.
 */

// Base error interface that all our custom errors should extend
export interface BaseError {
  message: string;
  code?: string;
  statusCode?: number;
  timestamp?: Date;
}

// Authentication related errors
export interface AuthError extends BaseError {
  type: 'AUTH_ERROR';
  provider?: 'email' | 'google' | 'apple';
}

// Purchase/subscription related errors
export interface PurchaseError extends BaseError {
  type: 'PURCHASE_ERROR';
  productId?: string;
  userCancelled?: boolean;
}

// API/Network related errors
export interface ApiError extends BaseError {
  type: 'API_ERROR';
  endpoint?: string;
  method?: string;
}

// Plan generation related errors
export interface PlanError extends BaseError {
  type: 'PLAN_ERROR';
  planId?: string;
  usageLimit?: boolean;
}

// General application errors
export interface AppError extends BaseError {
  type: 'APP_ERROR';
  feature?: string;
}

// Union type of all possible custom errors
export type MuhsinAIError = AuthError | PurchaseError | ApiError | PlanError | AppError;

// Type guard functions to check error types
export function isAuthError(error: any): error is AuthError {
  return error && typeof error === 'object' && error.type === 'AUTH_ERROR';
}

export function isPurchaseError(error: any): error is PurchaseError {
  return error && typeof error === 'object' && error.type === 'PURCHASE_ERROR';
}

export function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && error.type === 'API_ERROR';
}

export function isPlanError(error: any): error is PlanError {
  return error && typeof error === 'object' && error.type === 'PLAN_ERROR';
}

export function isAppError(error: any): error is AppError {
  return error && typeof error === 'object' && error.type === 'APP_ERROR';
}

// Utility function to create standardized errors
export function createError<T extends MuhsinAIError>(
  type: T['type'],
  message: string,
  additionalProps?: Partial<T>
): T {
  return {
    type,
    message,
    timestamp: new Date(),
    ...additionalProps,
  } as T;
}

// Utility function to safely extract error message from unknown error
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  
  return 'An unknown error occurred';
}

// Utility function to check if error is our custom error type
export function isMuhsinAIError(error: any): error is MuhsinAIError {
  return error && 
         typeof error === 'object' && 
         'type' in error && 
         ['AUTH_ERROR', 'PURCHASE_ERROR', 'API_ERROR', 'PLAN_ERROR', 'APP_ERROR'].includes(error.type);
}