import { ClientInterface } from '../client.interface';
import { Configuration, ConfigurationLoader } from '../../configs/configuration';
import { ResponseObject } from '../response';
import {
  BadRequestException,
  BaseException,
  InternalServerError,
  MethodNotAllowedException,
  NotFoundException,
  TooManyRequestsException,
  UnauthorizedException,
  UnprocessableEntityException
} from '../../exceptions';
import { HttpErrorsEnum } from '../../enums/http-errors.enum';
import { AxiosClient } from './axios-client.js';

/**
 * Базовый класс HTTP клиента
 */
export class BaseClient {
  /**
   * HTTP клиент
   */
  protected client!: ClientInterface;

  /**
   * Конфигурация HTTP клиента
   */
  protected config!: Configuration;

  /**
   * Конструктор базового HTTP клиента
   * 
   * @param {ClientInterface | null} client - HTTP клиент
   * @param {ConfigurationLoader | null} configurator - Загрузчик конфигурации
   */
  constructor(client: ClientInterface | null = null, configurator: ConfigurationLoader | null = null) {
    if (!client) {
      client = new AxiosClient();
    }

    if (!configurator) {
      configurator = new ConfigurationLoader();
    }

    this.config = configurator.load().getConfig();
    this.setConfig(this.config);

    this.setClient(client as ClientInterface);
  }

  /**
   * Получает текущую конфигурацию
   * 
   * @returns {Configuration} - Объект конфигурации
   */
  public getConfig(): Configuration {
    return this.config;
  }

  /**
   * Устанавливает конфигурацию
   * 
   * @param {Configuration} config - Объект конфигурации
   */
  public setConfig(config: Configuration): void {
    this.config = config;
  }

  /**
   * Устанавливает HTTP клиент
   * 
   * @param {ClientInterface} client - HTTP клиент
   * @returns {BaseClient} - Текущий экземпляр для цепочки вызовов
   */
  public setClient(client: ClientInterface): BaseClient {
    this.client = client;
    this.client.setConfig(this.config);

    return this;
  }

  /**
   * Получает текущий HTTP клиент
   * 
   * @returns {ClientInterface} - HTTP клиент
   */
  public getClient(): ClientInterface {
    return this.client;
  }

  /**
   * Устанавливает токен авторизации
   * 
   * @param {string} token - токен JWT
   * @returns {BaseClient} - Текущий экземпляр для цепочки вызовов
   */
  public setAuthToken(token: string): BaseClient {
    this.client.setBearerToken(token);

    return this;
  }

  /**
   * Декодирует JSON строку в объект
   * 
   * @param {ResponseObject} response - Объект ответа
   * @returns {any} - Декодированный JSON объект
   */
  protected decodeData(response: ResponseObject): any {
    return JSON.parse(response.getBody());
  }

  /**
   * Кодирует объект в JSON строку
   * 
   * @param {Record<string, any>} data - Объект для кодирования
   * @returns {string} - JSON строка
   */
  protected encodeData(data: Record<string, any>): string {
    if (Object.keys(data).length === 0) {
      return '{}';
    }

    return JSON.stringify(data);
  }

  /**
   * Обрабатывает ошибки API
   * 
   * @param {ResponseObject} response - Объект ответа
   * @throws {BadRequestException | UnauthorizedException | NotFoundException | InternalServerError | TooManyRequestsException | BaseException}
   */
  protected handleError(response: ResponseObject): void {
    const code = response.getCode();
    const headers = response.getHeaders();
    const body = response.getBody();

    // Логируем детали ошибки для диагностики
    console.error(`API Error: ${code}, Body: ${body}`);

    switch (code) {
      case NotFoundException.HTTP_CODE:
        throw new NotFoundException(headers, body);
      case InternalServerError.HTTP_CODE:
        throw new InternalServerError(headers, body);
      case BadRequestException.HTTP_CODE:
        throw new BadRequestException(headers, body);
      case UnauthorizedException.HTTP_CODE:
        throw new UnauthorizedException(headers, body);
      case TooManyRequestsException.HTTP_CODE:
        throw new TooManyRequestsException(headers, body);
      case MethodNotAllowedException.HTTP_CODE:
        throw new MethodNotAllowedException(headers, body);
      case UnprocessableEntityException.HTTP_CODE:
        throw new UnprocessableEntityException(headers, body);
      default:
        throw new BaseException(HttpErrorsEnum.UNKNOWN_ERROR, code, headers, body);
    }
  }

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
  protected async execute(
    path: string,
    method: string,
    queryParameters: Record<string, any>,
    httpBody: string | null = null,
    headers: Record<string, string> = {},
    callback: ((data: any) => void) | null = null
  ): Promise<ResponseObject> {
    return this.client.call(path, method, queryParameters, httpBody, headers, callback);
  }
} 