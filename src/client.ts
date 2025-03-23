import { BaseClient } from './http/clients/base-client';
import { EndpointsEnum } from './enums/endpoints.enum';
import { HttpMethods } from './enums/http-methods.enum';
import { SseClient } from './http/clients/sse-client';
import { StreamParameterNotSetException } from './exceptions';

/**
 * Основной класс клиента GenAPI SDK
 */
export class Client extends BaseClient {
  /**
   * Получает информацию о пользователе
   * 
   * @returns {Promise<Record<string, any> | null>} - Информация о пользователе
   */
  public async getMe(): Promise<Record<string, any> | null> {
    const response = await this.execute(EndpointsEnum.ME_PATH, HttpMethods.GET, {});

    if (response.isOk()) {
      return this.decodeData(response);
    } else {
      this.handleError(response);
      return null;
    }
  }

  /**
   * Создает задачу для нейросети
   * 
   * @param {string} networkId - ID нейросети
   * @param {Record<string, any>} parameters - Параметры запроса
   * @returns {Promise<Record<string, any> | null>} - Результат выполнения задачи
   */
  public async createNetworkTask(
    networkId: string,
    parameters: Record<string, any>
  ): Promise<Record<string, any> | null> {
    console.log('=== GenAPI Network Task ===');
    console.log('Network ID:', networkId);
    console.log('Parameters:', JSON.stringify(parameters, null, 2));
    console.log('=========================');
    
    const body = this.encodeData(parameters);
    const path = `${EndpointsEnum.CREATE_NETWORK_TASK_PATH}/${networkId}`;

    const response = await this.execute(path, HttpMethods.POST, {}, body);

    if (response.isOk()) {
      return this.decodeData(response);
    } else {
      console.log('=== GenAPI Network Task Error ===');
      console.log('Status:', response.getCode());
      console.log('Body:', response.getBody());
      console.log('Network ID:', networkId);
      console.log('Path:', path);
      console.log('Encoded body:', body);
      console.log('==============================');
      
      this.handleError(response);
      return null;
    }
  }

  /**
   * Создает потоковую задачу для нейросети
   * 
   * Получение ответа в виде SSE.
   * Используйте только для текстовых нейросетей с stream = true.
   * 
   * @param {string} networkId - ID нейросети
   * @param {Record<string, any>} parameters - Параметры запроса
   * @param {Function} callback - Колбэк для обработки SSE событий
   * @returns {Promise<boolean>} - Успешность выполнения
   */
  public async createStreamNetworkTask(
    networkId: string,
    parameters: Record<string, any>,
    callback: (data: any) => void
  ): Promise<boolean> {
    if (!parameters.hasOwnProperty('stream') || !parameters.stream) {
      throw new StreamParameterNotSetException();
    }

    this.client = new SseClient(this.client);
    const body = this.encodeData(parameters);
    const path = `${EndpointsEnum.CREATE_NETWORK_TASK_PATH}/${networkId}`;

    const response = await this.execute(path, HttpMethods.POST, {}, body, {}, callback);

    if (response.isOk()) {
      return true;
    } else {
      this.handleError(response);
      return false;
    }
  }

  /**
   * Получает информацию о запросе по ID
   * 
   * Этот запрос нужен для получения результата по ID задачи.
   * 
   * @param {number} requestId - ID запроса, полученный после создания задачи
   * @returns {Promise<Record<string, any> | null>} - Информация о запросе
   */
  public async getRequest(requestId: number): Promise<Record<string, any> | null> {
    const path = `${EndpointsEnum.GET_REQUEST_PATH}/${requestId}`;
    const response = await this.execute(path, HttpMethods.GET, {});

    if (response.isOk()) {
      return this.decodeData(response);
    } else {
      this.handleError(response);
      return null;
    }
  }

  /**
   * Создает задачу для ИИ функции
   * 
   * @param {string} functionId - ID ИИ функции
   * @param {Record<string, any>} parameters - Параметры запроса
   * @returns {Promise<Record<string, any> | null>} - Результат выполнения функции
   */
  public async createFunctionTask(
    functionId: string,
    parameters: Record<string, any>
  ): Promise<Record<string, any> | null> {
    const body = this.encodeData(parameters);
    const path = `${EndpointsEnum.CREATE_FUNCTION_TASK_PATH}/${functionId}`;

    const response = await this.execute(path, HttpMethods.POST, {}, body);

    if (response.isOk()) {
      return this.decodeData(response);
    } else {
      this.handleError(response);
      return null;
    }
  }
} 