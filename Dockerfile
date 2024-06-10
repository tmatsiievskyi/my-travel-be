FROM node:21.7

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 4000

CMD ["npm", "run", "start:dev"]