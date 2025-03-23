import { BaseException } from './base.exception';
import { HttpErrorsEnum } from '../enums/http-errors.enum';

/**
 * 400 Bad Request
 */
export class BadRequestException extends BaseException {
  static readonly HTTP_CODE = 400;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.BAD_REQUEST, BadRequestException.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedException extends BaseException {
  static readonly HTTP_CODE = 401;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.UNAUTHORIZED, UnauthorizedException.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

/**
 * 404 Not Found
 */
export class NotFoundException extends BaseException {
  static readonly HTTP_CODE = 404;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.NOT_FOUND, NotFoundException.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

/**
 * 405 Method Not Allowed
 */
export class MethodNotAllowedException extends BaseException {
  static readonly HTTP_CODE = 405;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.METHOD_NOT_ALLOWED, MethodNotAllowedException.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, MethodNotAllowedException.prototype);
  }
}

/**
 * 422 Unprocessable Entity
 */
export class UnprocessableEntityException extends BaseException {
  static readonly HTTP_CODE = 422;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.UNPROCESSABLE_ENTITY, UnprocessableEntityException.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, UnprocessableEntityException.prototype);
  }
}

/**
 * 429 Too Many Requests
 */
export class TooManyRequestsException extends BaseException {
  static readonly HTTP_CODE = 429;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.TOO_MANY_REQUESTS, TooManyRequestsException.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, TooManyRequestsException.prototype);
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends BaseException {
  static readonly HTTP_CODE = 500;
  
  constructor(headers: Record<string, string> = {}, body: string = '') {
    super(HttpErrorsEnum.INTERNAL_SERVER_ERROR, InternalServerError.HTTP_CODE, headers, body);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * Исключение для параметра stream
 */
export class StreamParameterNotSetException extends BaseException {
  constructor() {
    super('Stream parameter must be set to true for stream API calls', 400);
    Object.setPrototypeOf(this, StreamParameterNotSetException.prototype);
  }
}

export { BaseException } from './base.exception'; 