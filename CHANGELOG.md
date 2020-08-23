# CHANGELOG

## Unreleased

### Added

-   Add `GET /v1/renderer/ssr` route
-   Add `POST /v1/renderer/ssr` route
-   Add quota handling mechanism
-   Forward response errors

### Changed

-   (BREAKING) Replace `headers` option with `forwardHeaders` one in DTOs
-   Replace dotenv-flow with @nestjs/config
-   Disable domain blocking by default

### Removed

-   (BREAKING) Remove `/` and `/docs` routes from prod environment
-   Remove Saasify

## v1.0.0-canary.1

### Added

-   Add `GET /v1/renderer/csr`
-   Request validation

### Changed

-   (BREAKING) API version is prefix, not suffix anymore
-   Increase headless browser timeout to 30s

## v1.0.0-canary.0

### Added

-   Add `POST /renderer/csr` route
-   Add `ScrapeCommandDto.metadata: boolean` option to auto extract metadata and article content
-   Add `InputTarget.multiple: boolean` option to scrape all elements matched by the provided CSS selector
-   Add domain blocking feature
-   Support HTTP proxy for CSR
-   API versioning

### Changed

-   Rename project to **Sponge**
-   Some internal architectural changes

### Removed

-   Remove default HTML target when `ScrapeCommandDto.targets` is not provided or empty
-   Remove meaningless routes and redirect `GET /` to `GET /docs`

### Fixed

-   Fix @nestjs/swagger not recognize boolean type

## v0.7.0

### Features

-   Add `GET /` route
-   Split `POST /scraper` into `POST /scraper/csr` and `POST /scraper/ssr`; remove `ScrapeCommandDto.csr` option
-   Support passing custom request headers
-   Support passing HTTP proxy (SSR only for now)
-   Set 10s as the default timeout when fetching pages
-   Many internal improvements

### Bugfixes

-   Fix browsers won't start inside Docker

## v0.6.0

### Features

-   Make `ScrapeCommandDto.csr` option actually work by supporting SSR-only mode using JSDom
-   Add `InputTarget.attribute: string` option to get the target's attribute instead of text content
-   Add `TargetType.Html`
-   If `ScrapeCommandDto.targets` is not provided or empty, return a single target with its value is the whole HTML
-   Add Docker support

### Bugfixes

-   Fix @nestjs/swagger not recognize complex types
