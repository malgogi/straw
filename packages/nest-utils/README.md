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
