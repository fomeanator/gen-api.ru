/**
 * Перечисление HTTP ошибок
 */
export enum HttpErrorsEnum {
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  NOT_FOUND = 'Not Found',
  METHOD_NOT_ALLOWED = 'Method Not Allowed',
  TOO_MANY_REQUESTS = 'Too Many Requests',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  UNKNOWN_ERROR = 'Unknown Error'
}