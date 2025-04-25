import { AppError } from './base.error';

export class InvalidIdError extends AppError {
  constructor(message: string) {
    super(message);
  }
}
