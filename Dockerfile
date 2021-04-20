FROM node:14-alpine

COPY package*.json ./
RUN npm install --only=prod

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

EXPOSE 2200

CMD [ "node", "./dist/index.js" ]