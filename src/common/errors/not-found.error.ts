import { AppError } from './base.error';

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message);
  }
}
