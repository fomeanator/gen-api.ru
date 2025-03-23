import { HttpErrorsEnum } from '../enums/http-errors.enum';

/**
 * Базовый класс исключений для API
 */
export class BaseException extends Error {
  /**
   * HTTP код ошибки
   */
  public readonly statusCode: number;

  /**
   * Заголовки ответа
   */
  public readonly headers: Record<string, string>;

  /**
   * Тело ответа
   */
  public readonly body: string;

  /**
   * Конструктор базового исключения
   * 
   * @param message - Сообщение об ошибке
   * @param statusCode - HTTP код ошибки
   * @param headers - Заголовки ответа
   * @param body - Тело ответа
   */
  constructor(
    message: HttpErrorsEnum | string = HttpErrorsEnum.UNKNOWN_ERROR,
    statusCode: number = 500,
    headers: Record<string, string> = {},
    body: string = ''
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
    
    // Для правильной работы instanceof в ES6+
    Object.setPrototypeOf(this, BaseException.prototype);
  }
} 