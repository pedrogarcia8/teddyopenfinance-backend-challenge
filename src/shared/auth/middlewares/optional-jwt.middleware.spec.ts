import { OptionalJwtMiddleware } from './optional-jwt.middleware';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Optional Jwt Middleware', () => {
  let middleware: OptionalJwtMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    middleware = new OptionalJwtMiddleware();
    mockRequest = {};
    mockResponse = {};
    next = jest.fn();
  });

  it('Should add decoded user to request if token is valid', () => {
    const token = 'validToken';
    const decoded = { userId: '123', email: 'email' };

    (jwt.verify as jest.Mock).mockReturnValueOnce(decoded);

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      next as NextFunction,
    );

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(mockRequest.user).toEqual(decoded);
    expect(next).toHaveBeenCalled();
  });

  it('Should not add user to request if token is invalid', () => {
    const token = 'invalidToken';

    (jwt.verify as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    mockRequest.headers = {
      authorization: `Bearer ${token}`,
    };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      next as NextFunction,
    );

    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(mockRequest.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('Should not add user to request if no token is provided', () => {
    mockRequest.headers = {};

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      next as NextFunction,
    );

    expect(mockRequest.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });

  it('Should not add user to request if authorization header is malformed', () => {
    mockRequest.headers = {
      authorization: 'Bearer',
    };

    middleware.use(
      mockRequest as Request,
      mockResponse as Response,
      next as NextFunction,
    );

    expect(mockRequest.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
