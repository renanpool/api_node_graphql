FROM node:20

WORKDIR /app

COPY /app/index.js .

RUN npm init -y
RUN npm install apollo-server graphql dotenv

EXPOSE 4000

CMD ["node", "index.js"]