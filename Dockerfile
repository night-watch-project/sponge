FROM node:latest AS dev

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

#

FROM node:latest AS prod

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --only=production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

EXPOSE 3211

CMD npm run start:prod
