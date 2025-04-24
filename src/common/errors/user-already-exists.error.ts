import { AppError } from './base.error';

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super('User already exists');
  }
}
