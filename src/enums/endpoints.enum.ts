/**
 * Перечисление URL путей для API эндпоинтов
 */
export enum EndpointsEnum {
  /**
   * Получение информации о пользователе
   */
  ME_PATH = '/api/v1/user',

  /**
   * Создание задачи для нейросети
   */
  CREATE_NETWORK_TASK_PATH = '/api/v1/networks',

  /**
   * Создание задачи для ИИ функции
   */
  CREATE_FUNCTION_TASK_PATH = '/api/v1/functions',

  /**
   * Получение информации о задаче
   */
  GET_REQUEST_PATH = '/api/v1/request/get'
} 