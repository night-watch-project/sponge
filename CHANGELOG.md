# CHANGELOG

## NEXT

### Features

- Rename project to **Sponge**
- Add `ScrapeCommandDto.metadata: boolean` option to auto extract metadata and content of articles
- Add `POST /renderer/csr` route
- Add domain blocking feature
- Remove default HTML target when `ScrapeCommandDto.targets` is not provided or empty
- Remove meaningless routes and redirect `GET /` to `GET /docs`
- Some internal architectural changes

### Bugfixes

- Fix @nestjs/swagger not recognize boolean type

## V0.7.0

### Features

- Add `GET /` route
- Split `POST /scraper` into `POST /scraper/csr` and `POST /scraper/ssr`; remove `ScrapeCommandDto.csr` option
- Support passing custom request headers
- Support passing HTTP proxy (SSR only for now)
- Set 10s as the default timeout when fetching pages
- Many internal improvements

### Bugfixes

- Fix browsers won't start inside Docker

## V0.6.0

### Features

- Make `ScrapeCommandDto.csr` option actually work by supporting SSR-only mode using JSDom
- Add `InputTarget.attribute: string` option to get the target's attribute instead of text content
- Add `TargetType.Html`
- If `ScrapeCommandDto.targets` is not provided or empty, return a single target with its value is the whole HTML
- Add Docker support

### Bugfixes

- Fix @nestjs/swagger not recognize complex types
