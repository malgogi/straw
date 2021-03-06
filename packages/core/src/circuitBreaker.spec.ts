import {interval, of} from 'rxjs';
import {concatMap, delay, take} from 'rxjs/operators';
import {circuitBreaker} from './circuitBreaker';

it('always success case', (done) => {
    interval(1000)
        .pipe(circuitBreaker<number, number>({
            failureThreshold: 30,
            execute: () => 1,
            fallback: () => 2,
        }))
        .pipe(take(3))
        .subscribe({
            next(item) { expect(item).toEqual(1); },
            complete() { done(); }
        });
});

it('fallback counter test', (done) => {
    let counter = 0;
    const result = [0, 0];
    of(1,2,3,4,5,6,7,8,9,10)
        .pipe(concatMap((x) => of(x).pipe(delay(400))))
        .pipe(circuitBreaker<number, number>({
            failureThreshold: 2,
            timeoutSeconds: 2,
            execute: () => {
                if(counter++ > 2 && counter < 7) {
                    throw new Error('error');
                } else {
                    return 0;
                }
            },
            fallback: () => {
                return 1;
            },
        }))
        .subscribe({
            next(index) { result[index] += 1; },
            error() { throw new Error('It should not emit error.'); },
            complete() {
                expect(result[0]).toEqual(5);
                expect(result[1]).toEqual(5);
                expect(result[0] + result[1]).toEqual(10);
                done();
            }
        });
}, 60 * 1000);

it('async execution method test', (done) => {
  let counter = 0;
  const result = [0, 0];
  of(1,2,3,4,5,6,7,8,9,10)
    .pipe(concatMap((x) => of(x).pipe(delay(400))))
    .pipe(circuitBreaker<number, number>({
      failureThreshold: 2,
      timeoutSeconds: 2,
      execute: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if(counter++ > 2 && counter < 7) {
              reject(new Error('error'));
            } else {
              return resolve(0);
            }
          }, 1000);
        });
      },
      fallback: () => {
        return 1;
      },
    }))
    .subscribe({
      next(index) { result[index] += 1; },
      error() { throw new Error('It should not emit error.'); },
      complete() {
        expect(result[0]).toEqual(5);
        expect(result[1]).toEqual(5);
        expect(result[0] + result[1]).toEqual(10);
        done();
      }
    });
}, 60 * 1000);
