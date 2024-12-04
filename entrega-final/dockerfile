FROM node:20

WORKDIR /brando1607/codercommerce:1.0.0

COPY package*.json ./

RUN npm install

COPY  . .

EXPOSE 8080

CMD ["npm", "run", "dev"]