import { AppError } from './base.error';

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid email or password');
  }
}
