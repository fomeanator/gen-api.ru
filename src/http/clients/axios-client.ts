import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ClientInterface } from '../client.interface';
import { Configuration } from '../../configs/configuration';
import { ResponseObject } from '../response';
import { createParser } from 'eventsource-parser';

/**
 * HTTP клиент на основе Axios
 */
export class AxiosClient implements ClientInterface {
  /**
   * Конфигурация
   */
  protected config: Configuration = { url: '' };

  /**
   * Токен авторизации
   */
  protected bearerToken: string | null = null;

  /**
   * Заголовки по умолчанию
   */
  protected defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  /**
   * Экземпляр Axios
   */
  protected axiosInstance: AxiosInstance = axios.create();

  /**
   * Таймаут запроса в миллисекундах
   */
  protected timeout: number = 100000;

  /**
   * Возвращает текущую конфигурацию
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
   * Устанавливает токен авторизации
   * 
   * @param {string | null} bearerToken - Токен JWT или null
   */
  public setBearerToken(bearerToken: string | null): void {
    this.bearerToken = bearerToken;
  }

  /**
   * Возвращает токен авторизации
   * 
   * @returns {string | null} - Токен JWT или null
   */
  public getBearerToken(): string | null {
    return this.bearerToken;
  }

  /**
   * Возвращает базовый URL из конфигурации
   * 
   * @returns {string} - Базовый URL
   */
  private getBaseUrl(): string {
    return this.config.url;
  }

  /**
   * Создает полный URL запроса
   * 
   * @param {string} path - Путь запроса
   * @param {Record<string, any>} queryParams - Параметры запроса
   * @returns {string} - Полный URL запроса
   */
  protected prepareUrl(path: string, queryParams: Record<string, any>): string {
    const baseUrl = this.getBaseUrl();
    const url = new URL(path, baseUrl);

    // Добавляем параметры запроса
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });

    return url.toString();
  }

  /**
   * Подготавливает заголовки запроса
   * 
   * @param {Record<string, string>} headers - Заголовки запроса
   * @returns {Record<string, string>} - Подготовленные заголовки
   * @throws {Error} - Если не задан токен авторизации
   */
  protected prepareHeaders(headers: Record<string, string>): Record<string, string> {
    const result = { ...this.defaultHeaders, ...headers };

    if (this.bearerToken) {
      result['Authorization'] = `Bearer ${this.bearerToken}`;
    }

    if (!result['Authorization']) {
      throw new Error('Authorization header not set');
    }

    return result;
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
    try {
      const url = this.prepareUrl(path, queryParameters);
      const preparedHeaders = this.prepareHeaders(headers);

      const config: AxiosRequestConfig = {
        method: method,
        url: url,
        headers: preparedHeaders,
        timeout: this.timeout,
        responseType: callback ? 'stream' : 'text'
      };

      if (httpBody) {
        config.data = httpBody;
      }

      // Логируем детали запроса
      console.log('=== GenAPI Request Details ===');
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('Headers:', JSON.stringify(preparedHeaders, null, 2));
      console.log('Body:', httpBody);
      console.log('===========================');

      // Если нужна обработка SSE событий
      if (callback) {
        return this.handleStreamResponse(config, callback);
      }

      const response = await this.axiosInstance.request(config);

      // Логируем детали ответа
      console.log('=== GenAPI Response Details ===');
      console.log('Status:', response.status);
      console.log('Headers:', JSON.stringify(response.headers, null, 2));
      console.log('Body:', typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2));
      console.log('=============================');

      return new ResponseObject({
        code: response.status,
        headers: this.normalizeHeaders(response.headers),
        body: typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Логируем детали ошибки
        console.log('=== GenAPI Error Details ===');
        console.log('Status:', error.response.status);
        console.log('Headers:', JSON.stringify(error.response.headers, null, 2));
        console.log('Body:', typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data, null, 2));
        console.log('Request URL:', error.config?.url);
        console.log('Request Method:', error.config?.method?.toUpperCase());
        console.log('Request Body:', error.config?.data);
        console.log('===========================');

        return new ResponseObject({
          code: error.response.status,
          headers: this.normalizeHeaders(error.response.headers),
          body: typeof error.response.data === 'string' 
            ? error.response.data 
            : JSON.stringify(error.response.data)
        });
      }
      
      // Логируем неизвестную ошибку
      console.error('=== GenAPI Unknown Error ===');
      console.error(error);
      console.error('===========================');
      
      throw error;
    }
  }

  /**
   * Нормализует заголовки ответа
   * 
   * @param {Record<string, any>} headers - Заголовки ответа
   * @returns {Record<string, string>} - Нормализованные заголовки
   */
  protected normalizeHeaders(headers: Record<string, any>): Record<string, string> {
    const result: Record<string, string> = {};
    
    Object.entries(headers).forEach(([key, value]) => {
      result[key] = String(value);
    });
    
    return result;
  }

  /**
   * Обрабатывает потоковый ответ (SSE)
   * 
   * @param {AxiosRequestConfig} config - Конфигурация запроса
   * @param {Function} callback - Колбэк для обработки SSE событий
   * @returns {Promise<ResponseObject>} - Объект ответа
   */
  protected async handleStreamResponse(
    config: AxiosRequestConfig,
    callback: (data: any) => void
  ): Promise<ResponseObject> {
    return new Promise((resolve, reject) => {
      let responseObject: ResponseObject | null = null;
      
      this.axiosInstance.request(config)
        .then((response: AxiosResponse) => {
          const stream = response.data;
          
          responseObject = new ResponseObject({
            code: response.status,
            headers: this.normalizeHeaders(response.headers),
            body: ''
          });
          
          const parser = createParser((event) => {
            if (event.type === 'event') {
              try {
                const data = JSON.parse(event.data);
                callback(data);
              } catch (e) {
                callback(event.data);
              }
            }
          });
          
          stream.on('data', (chunk: Buffer) => {
            const chunkString = chunk.toString();
            parser.feed(chunkString);
          });
          
          stream.on('end', () => {
            resolve(responseObject as ResponseObject);
          });
          
          stream.on('error', (err: Error) => {
            reject(err);
          });
        })
        .catch((error) => {
          if (axios.isAxiosError(error) && error.response) {
            resolve(new ResponseObject({
              code: error.response.status,
              headers: this.normalizeHeaders(error.response.headers),
              body: typeof error.response.data === 'string' 
                ? error.response.data 
                : JSON.stringify(error.response.data)
            }));
          } else {
            reject(error);
          }
        });
    });
  }
} 