import HttpStatusCode from '@itypes/httpStatusCode.type';
import { AppError } from './app.exception';

export class WrongCredentialsException extends AppError {
  constructor() {
    super('Email or password does not match', HttpStatusCode.UNAUTHORIZED);
  }
}
