FROM node:22

WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src

RUN npm install
RUN npm run build

EXPOSE 3000


CMD ["npm", "start"]