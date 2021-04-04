# @malgogi-rx-straw/nest-utils

## Description

Nest utitlity libs.


## Installation

Using NPM:

```bash
npm i --save @malgogi-rx-straw/nest-utils
```

Using YARN:
```
yarn add @malgogi-rx-straw/nest-utils --save
```

## Dependencies

```json
{
  "dependencies": {
    "@malgogi-rx-straw/core": "0.0.6",
    "moment": "2.29.1",
    "node-cron": "^3.0.0",
    "rxjs": "^6.6.6"
  },
  "devDependencies": {
    "@nestjs/common": "7.6.15",
    "@nestjs/core": "7.6.15",
    "@nestjs/platform-express": "7.6.15",
    "@nestjs/testing": "7.6.15",
    "@types/supertest": "2.0.11",
    "reflect-metadata": "0.1.13",
    "supertest": "6.1.3"
  },
  "peerDependencies": {
    "@nestjs/common": "7.6.15",
    "@nestjs/core": "7.6.15",
    "@nestjs/platform-express": "7.6.15",
    "reflect-metadata": "0.1.13"
  }
}
```

## Examples

## HttpThrottleRequestInterceptor

It throttles only http request. ( Supports only http request, others will be ignored ).
It supports only thumbling window method. ( It will be updated. )

### Usages
```typescript

// app.ts
// Allow 1 request every 2 seconds( thumbling window ).
// If you request over 2 requests in 2 seconds.
// It will respond with 429 http status code.  (Too many requests.)
app.useGlobalInterceptors(new HttpThrottleRequestInterceptor(2));
```
