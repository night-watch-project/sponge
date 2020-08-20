### STAGE 1

FROM nightwatchproject/base AS builder
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

### STAGE 2

FROM nightwatchproject/base

ENV PORT=3000
ENV PLAYWRIGHT_BROWSERS_PATH=0

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --only=production
COPY . .
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE ${PORT}

CMD [ "npm", "run", "start:prod" ]
