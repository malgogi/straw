import {interval, Observable, of} from "rxjs";
import {circuitBreaker} from "./circuitBreaker";
import {take} from "rxjs/operators";

it('always success case', (done) => {
    interval(1000)
        .pipe(circuitBreaker<number, number>({
            failureThreshold: 30,
            execute: (source) => 1,
            fallback: () => 2,
        }))
        .pipe(take(3))
        .subscribe({
            next(item) { console.log('received', item); expect(item).toEqual(1); },
            complete() { done(); }
        });
});

it('edge case', (done) => {
    interval(1000)
        .pipe(circuitBreaker<number, number>({
            failureThreshold: 2,
            execute: () => {
                throw new Error('error');
            },
            fallback: () => 2,
        }))
        .pipe(take(3))
        .subscribe({
            next(item) { console.log('received', item); expect(item).toEqual(1); },
            error(error) { console.error('error', error); },
            complete() { done(); }
        });
});
