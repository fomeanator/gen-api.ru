import { ResponseObject } from './response';
import { Configuration } from '../configs/configuration';

/**
 * Интерфейс для HTTP клиента
 */
export interface ClientInterface {
  /**
   * Получает текущую конфигурацию
   * 
   * @returns {Configuration} - Объект конфигурации
   */
  getConfig(): Configuration;

  /**
   * Устанавливает конфигурацию
   * 
   * @param {Configuration} config - Объект конфигурации
   */
  setConfig(config: Configuration): void;

  /**
   * Устанавливает токен авторизации
   * 
   * @param {string | null} bearerToken - JWT токен или null
   */
  setBearerToken(bearerToken: string | null): void;

  /**
   * Получает токен авторизации
   * 
   * @returns {string | null} - Текущий токен авторизации или null
   */
  getBearerToken(): string | null;

  /**
   * Выполняет HTTP-запрос
   * 
   * @param {string} path - Путь запроса
   * @param {string} method - HTTP метод
   * @param {Record<string, any>} queryParameters - Параметры запроса
   * @param {string | null} httpBody - Тело запроса
   * @param {Record<string, string>} headers - Заголовки запроса
   * @param {Function | null} callback - Колбэк для обработки событий SSE
   * @returns {Promise<ResponseObject>} - Объект ответа
   */
  call(
    path: string,
    method: string,
    queryParameters: Record<string, any>,
    httpBody?: string | null,
    headers?: Record<string, string>,
    callback?: ((data: any) => void) | null
  ): Promise<ResponseObject>;
} 