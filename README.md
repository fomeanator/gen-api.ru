<p align="center"><a href="https://gen-api.ru" target="_blank"><img src="https://api.gen-api.ru/storage/logo.svg" width="200" alt="GenAPI Logo"></a></p>

<p align="center">
<a href="https://www.npmjs.com/package/genapi-sdk-ts"><img src="https://img.shields.io/npm/v/genapi-sdk-ts" alt="Version"></a>
<a href="https://www.npmjs.com/package/genapi-sdk-ts"><img src="https://img.shields.io/npm/l/genapi-sdk-ts" alt="License"></a>
<a href="https://www.npmjs.com/package/genapi-sdk-ts"><img src="https://img.shields.io/npm/dt/genapi-sdk-ts" alt="Downloads"></a>
</p>

# О нас

**GenAPI** — платформа, предлагающая API для интеграции различных нейросетей в ваши проекты. Она облегчает использование современных моделей AI для обработки текста, генерации изображений, аудио и видео. Регулярно обновляемый список нейросетей предоставляет доступ к последним технологиям в области искусственного интеллекта. Узнайте больше на сайте [GenAPI](https://gen-api.ru).

## 🚀 Требования

- Node.js версии 14 или выше.

## 📦 Установка

### Установка с использованием npm

```bash
npm install genapi-sdk-ts
```

### Установка с использованием yarn

```bash
yarn add genapi-sdk-ts
```

## 🛠️ Начало работы

1. **Импортируйте клиент**:

```typescript
import { Client } from 'genapi-sdk-ts';
```

2. **Создайте экземпляр клиента**:

```typescript
const client = new Client();
client.setAuthToken('yourBearerToken'); // Получите токен в личном кабинете: https://gen-api.ru/account/api-tokens
```

## 🌟 Основные возможности

С помощью этой библиотеки вы можете:

- Создавать задачи для нейросетей
- Работать с ИИ функциями
- Проверять статус задач
- Получать информацию о своем аккаунте и балансе

## 📋 Примеры использования

### Получение информации о пользователе

```typescript
async function getUserInfo() {
  try {
    const userInfo = await client.getMe();
    console.log(userInfo);
  } catch (error) {
    console.error('Ошибка при получении информации о пользователе:', error);
  }
}
```

### Создание задачи для нейросети

```typescript
async function generateText() {
  try {
    const parameters = {
      messages: [
        { role: 'user', content: 'Привет, как дела?' }
      ],
      temperature: 0.7,
      // другие параметры...
    };
    
    const result = await client.createNetworkTask('chatgpt-4', parameters);
    console.log(result);
  } catch (error) {
    console.error('Ошибка при генерации текста:', error);
  }
}
```

### Потоковая генерация текста

```typescript
async function generateStreamText() {
  try {
    const parameters = {
      messages: [
        { role: 'user', content: 'Расскажи длинную историю' }
      ],
      temperature: 0.7,
      stream: true // Обязательный параметр для потоковой генерации
    };
    
    await client.createStreamNetworkTask('chatgpt-4', parameters, (data) => {
      console.log('Получен фрагмент:', data);
    });
  } catch (error) {
    console.error('Ошибка при потоковой генерации:', error);
  }
}
```

### Получение информации о задаче

```typescript
async function getTaskInfo(requestId) {
  try {
    const taskInfo = await client.getRequest(requestId);
    console.log(taskInfo);
  } catch (error) {
    console.error('Ошибка при получении информации о задаче:', error);
  }
}
```

### Использование ИИ-функций

```typescript
async function useAIFunction() {
  try {
    const parameters = {
      text: 'Текст для анализа'
      // другие параметры, специфичные для функции
    };
    
    const result = await client.createFunctionTask('sentiment-analysis', parameters);
    console.log(result);
  } catch (error) {
    console.error('Ошибка при использовании ИИ-функции:', error);
  }
}
```

## 🌐 Доступные нейросети

Список регулярно обновляется, следите за последними изменениями на сайте [GenAPI](https://gen-api.ru/models).

| Название нейросети    | Версия                                |
|-----------------------|---------------------------------------|
| 🤖 ChatGPT            | 3.5, 4, omni, o1                      |
| 🌞 Claude             | Haiku 3, Sonnet 3, Sonnet 3.5, Opus 3 |
| 🌈 Stable Diffusion   | XL, lightning, 3, 3.5, ControlNet     |
| 🗣️ TTS от OpenAI     | tts, tts-hd                           |
| 🎨 DALL-E             | 2, 3                                  |
| 🌌 Midjourney         | 5.0, 5.1, 5.2, 6.0, 6.1               |
| 🔍 Real ESRGAN        |                                       |
| 📝 Whisper            |                                       |
| 📊 Embeddings         | 3-small, 3-large, ada-002             |
| 📷 Midas              |                                       |
| 🌟 Luma               |                                       |
| 🎉 Fooocus            |                                       |
| 🎵 Suno               |                                       |
| ⚡ Flux                | dev, schnell, pro, realism, pro v1.1  |
| 🎥 CogVideoX 5B       |                                       |
| 🚀 Runway Gen-3 Alpha | gen3a_turbo                           |
| 🌟 Kling              | pro, standard                         |
| 🎨 Kolors             |                                       |

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. Подробности см. в файле [LICENSE](LICENSE).

## 🙏 Поддержка

Если у вас возникли вопросы или проблемы, пожалуйста, создайте issue на GitHub или свяжитесь с нами через [сайт](https://gen-api.ru/contacts). 