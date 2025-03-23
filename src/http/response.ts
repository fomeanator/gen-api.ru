/**
 * Интерфейс для параметров ответа API
 */
export interface ResponseParams {
  code: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Класс для объекта ответа API
 */
export class ResponseObject {
  /**
   * HTTP код ответа
   */
  private readonly code: number;

  /**
   * Заголовки ответа
   */
  private readonly headers: Record<string, string>;

  /**
   * Тело ответа
   */
  private readonly body: string;

  /**
   * Конструктор класса ResponseObject
   * 
   * @param params - Параметры ответа
   */
  constructor(params: ResponseParams) {
    this.code = params.code;
    this.headers = params.headers;
    this.body = params.body;
  }

  /**
   * Проверяет успешность ответа
   * 
   * @returns {boolean} - true если ответ успешный (2xx)
   */
  public isOk(): boolean {
    return this.code >= 200 && this.code < 300;
  }

  /**
   * Возвращает код ответа
   * 
   * @returns {number} - HTTP код ответа
   */
  public getCode(): number {
    return this.code;
  }

  /**
   * Возвращает заголовки ответа
   * 
   * @returns {Record<string, string>} - Заголовки ответа
   */
  public getHeaders(): Record<string, string> {
    return this.headers;
  }

  /**
   * Возвращает тело ответа
   * 
   * @returns {string} - Тело ответа в виде строки
   */
  public getBody(): string {
    return this.body;
  }
} 