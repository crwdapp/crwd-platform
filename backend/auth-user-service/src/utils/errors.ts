export class AuthError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

export class ValidationError extends Error {
  public statusCode: number;
  public details: any;

  constructor(message: string, details?: any, statusCode: number = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class DatabaseError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = statusCode;
  }
}
