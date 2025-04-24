FROM node:20-alpine

# Установка необходимых пакетов
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения
RUN npm run build

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

# Запуск в режиме разработки
CMD ["npm", "run", "dev"] 