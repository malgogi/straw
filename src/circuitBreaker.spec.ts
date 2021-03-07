import {from, interval, Observable, of, range, timer} from "rxjs";
import {circuitBreaker} from "./circuitBreaker";
import {catchError, concatMap, delay, map, take} from "rxjs/operators";
import {TestScheduler} from "rxjs/testing";

it('always success case', (done) => {
    interval(1000)
        .pipe(circuitBreaker<number, number>({
            failureThreshold: 30,
            execute: (source) => 1,
            fallback: () => 2,
        }))
        .pipe(take(3))
        .subscribe({
            next(item) { expect(item).toEqual(1); },
            complete() { done(); }
        });
});

it('basic tc test', (done) => {
    let counter = 0;
    of(1,2,3,4,5,6,7,8,9,10)
        .pipe(concatMap((x) => of(x).pipe(delay(300))))
        .pipe(circuitBreaker<number, number>({
            failureThreshold: 2,
            timeoutSeconds: 2,
            execute: (item) => {
                if(counter++ > 2 && counter < 5) {
                    throw new Error('error');
                } else {
                    return 1;
                }
            },
            fallback: (item) => {
                return 2;
            },
        }))
        .subscribe({
            next(item) { expect(item).toBeLessThan(3); },
            error(error) { done(); },
            complete() { done(); }
        });
}, 60 * 1000);
