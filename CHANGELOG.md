# CHANGELOG

## NEXT

### Features

- Make `ScrapeCommandDto.csr` actually work by supporting SSR-only mode using JSDom
- Add `InputTarget.attribute: string` option to get the target's attribute instead of textContent
- Add `TargetType.Html`
- If `ScrapeCommandDto.targets` is not provided or empty, return a single target with its value is the whole HTML

### Bugfixes

- Fix @nestjs/swagger not recognize complex types
