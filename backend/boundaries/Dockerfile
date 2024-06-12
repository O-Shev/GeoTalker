FROM node:22-alpine

WORKDIR /boundaries-app

COPY package.json .

RUN npm install --only=prod

COPY . .

CMD ["npm", "run", "start:prod"]
