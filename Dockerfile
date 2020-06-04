### STAGE 1

FROM node:latest AS builder

WORKDIR /usr/src/app

COPY package.json ./

ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

RUN npm install

COPY . .

RUN npm run build

### STAGE 2

FROM node:latest

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD npm run start:prod
