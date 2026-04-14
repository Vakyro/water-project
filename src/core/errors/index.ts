import { logger } from '@/lib/logger'

export enum ErrorCode {
  DATABASE_QUERY_ERROR    = 'DATABASE_QUERY_ERROR',
  EMBEDDING_SERVICE_ERROR = 'EMBEDDING_SERVICE_ERROR',
  LLM_SERVICE_ERROR       = 'LLM_SERVICE_ERROR',
  INVALID_INPUT           = 'INVALID_INPUT',
  UNKNOWN_ERROR           = 'UNKNOWN_ERROR',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.DATABASE_QUERY_ERROR, message, details)
    this.name = 'DatabaseError'
  }
}

export class EmbeddingServiceError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.EMBEDDING_SERVICE_ERROR, message, details)
    this.name = 'EmbeddingServiceError'
  }
}

export class LLMServiceError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.LLM_SERVICE_ERROR, message, details)
    this.name = 'LLMServiceError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(ErrorCode.INVALID_INPUT, message, details)
    this.name = 'ValidationError'
  }
}

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AppError) return error
    if (error instanceof Error) {
      return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, { originalError: error })
    }
    return new AppError(ErrorCode.UNKNOWN_ERROR, 'An unexpected error occurred', { error })
  }

  static log(error: AppError): void {
    logger.error(`[${error.code}] ${error.message}`, error.details)
  }
}
