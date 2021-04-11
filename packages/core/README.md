# @malgogi-rx-straw/core

## Description

malgogi-rx-straw is rxjs utility library.


## Installation

Using NPM:

```bash
npm i --save @malgogi-rx-straw/core
```

Using YARN:
```
yarn add @malgogi-rx-straw/core --save
```

## Examples

## cron

cron is wrapper function of [moment](https://www.npmjs.com/package/moment), [node-cron](https://www.npmjs.com/package/node-cron)

```typescript
cron('* * * * * *')
    .subscribe((utcTimeInMillis: number) => {
        console.log(`task was started at ${utcTimeInMillis}`);
        // do task
    })
```

## circuitBreaker

```typescript
interval(1000)
    .pipe(circuitBreaker<number, number>({
        failureThreshold: 30,
        execute: (source) => {
            // do business logic.
            return 1;
        },
        fallback: () => {
            // fail action.
            return 2;
        },
    }))
    .pipe(take(3))
    .subscribe({
        next(item) { console.log('You can get a 1 or 2') },
        complete() { done(); }
    });
```
