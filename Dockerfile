FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN NEXT_DISABLE_ESLINT=1 npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["npm", "run", "start"]
