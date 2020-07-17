# Sponge

Hassle-free web scraping service.

## FEATURES

### Core Features

- Render client-side-rendered web pages
- Ad blocking
- Auto extract metadata and article content
- Extract text content, attribute value or inner HTML of any elements via CSS selectors
- Support custom request headers such as user-agent, cookies,...
- Support HTTP proxy _(SSR only for now)_

### Live Version Features

- Bundled with a blocklist of over 57,000 adware and malware domains

## INSTALLATION

### Requirements

- Node.js >= 14
- Environment variables specified in [.env.example](https://github.com/night-watch-project/sponge/blob/master/.env.example)

### Instructions

#### Without Docker (dev environment)

```shell
$ npm i             # yarn install
$ npm run start:dev # yarn start:dev
```

#### With Docker (prod environment)

```shell
$ npm run docker:build:app  # yarn docker:build:app
$ npm run docker:start:prod # yarn docker:start:prod
```

## CHANGELOG

Read more [here](https://github.com/night-watch-project/sponge/blob/master/CHANGELOG.md).

## TODO

Read more [here](https://github.com/night-watch-project/sponge/blob/master/TODO.md).
