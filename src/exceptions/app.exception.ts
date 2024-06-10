import HttpStatusCode from '@itypes/httpStatusCode.type';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = HttpStatusCode.BAD_REQUEST,
  ) {
    super(message);
  }
}

export class AuthTokenError extends AppError {
  constructor() {
    super('Wrong auth token', HttpStatusCode.UNAUTHORIZED);
  }
}

export class BadRequest extends AppError {
  constructor(message: string) {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}
