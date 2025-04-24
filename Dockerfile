FROM node:20-bullseye-slim

# Установка необходимых пакетов
RUN apt-get update && \
    apt-get install -y python3 make g++ git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Очистка кэша npm и установка зависимостей
RUN npm cache clean --force && \
    npm install

# Копирование остальных файлов проекта
COPY . .

# Сборка приложения
RUN npm run build

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development
ENV RUST_BACKTRACE=1

# Запуск в режиме разработки
CMD ["npm", "run", "dev"] 