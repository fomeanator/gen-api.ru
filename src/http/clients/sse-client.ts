import { ClientInterface } from '../client.interface';
import { Configuration } from '../../configs/configuration';
import { ResponseObject } from '../response';
import { AxiosClient } from './axios-client.js';

/**
 * Класс для работы с Server-Sent Events (SSE)
 */
export class SseClient implements ClientInterface {
  /**
   * Базовый HTTP клиент
   */
  private baseClient: ClientInterface;

  /**
   * Конструктор
   * 
   * @param {ClientInterface} client - HTTP клиент
   */
  constructor(client: ClientInterface) {
    this.baseClient = client;
  }

  /**
   * Получает текущую конфигурацию
   * 
   * @returns {Configuration} - Объект конфигурации
   */
  public getConfig(): Configuration {
    return this.baseClient.getConfig();
  }

  /**
   * Устанавливает конфигурацию
   * 
   * @param {Configuration} config - Объект конфигурации
   */
  public setConfig(config: Configuration): void {
    this.baseClient.setConfig(config);
  }

  /**
   * Устанавливает токен авторизации
   * 
   * @param {string | null} bearerToken - Токен JWT или null
   */
  public setBearerToken(bearerToken: string | null): void {
    this.baseClient.setBearerToken(bearerToken);
  }

  /**
   * Получает токен авторизации
   * 
   * @returns {string | null} - Токен JWT или null
   */
  public getBearerToken(): string | null {
    return this.baseClient.getBearerToken();
  }

  /**
   * Выполняет HTTP-запрос
   * 
   * @param {string} path - Путь запроса
   * @param {string} method - HTTP метод
   * @param {Record<string, any>} queryParameters - Параметры запроса
   * @param {string | null} httpBody - Тело запроса
   * @param {Record<string, string>} headers - Заголовки запроса
   * @param {Function | null} callback - Колбэк для обработки SSE событий
   * @returns {Promise<ResponseObject>} - Объект ответа
   */
  public async call(
    path: string,
    method: string,
    queryParameters: Record<string, any>,
    httpBody: string | null = null,
    headers: Record<string, string> = {},
    callback: ((data: any) => void) | null = null
  ): Promise<ResponseObject> {
    // Добавляем заголовок для принятия SSE
    headers = {
      ...headers,
      'Accept': 'text/event-stream'
    };

    return this.baseClient.call(path, method, queryParameters, httpBody, headers, callback);
  }
} 