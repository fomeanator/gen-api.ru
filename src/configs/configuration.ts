import * as fs from 'fs';
import * as path from 'path';

/**
 * Интерфейс конфигурации
 */
export interface Configuration {
  url: string;
}

/**
 * Загрузчик конфигурации
 */
export class ConfigurationLoader {
  /**
   * Объект конфигурации
   */
  private config: Configuration = { url: 'https://api.gen-api.ru' };

  /**
   * Загружает конфигурацию из файла
   * 
   * @returns {ConfigurationLoader} - инстанс загрузчика конфигурации
   */
  public load(): ConfigurationLoader {
    try {
      // Попытка загрузить файл из корня проекта
      const configPath = path.resolve(process.cwd(), 'configuration.json');
      
      if (fs.existsSync(configPath)) {
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } else {
        // Использование встроенной конфигурации
        const packageConfigPath = path.resolve(__dirname, '../../configuration.json');
        this.config = JSON.parse(fs.readFileSync(packageConfigPath, 'utf8'));
      }
      
      return this;
    } catch (error) {
      // Если не удалось загрузить конфигурацию, используем значения по умолчанию
      this.config = {
        url: 'https://api.gen-api.ru'
      };

      return this;
    }
  }

  /**
   * Возвращает конфигурацию
   * 
   * @returns {Configuration} - объект конфигурации
   */
  public getConfig(): Configuration {
    return this.config;
  }
} 