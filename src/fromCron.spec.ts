import {cron} from "./fromCron";
import {isNumeric} from "rxjs/internal-compatibility";

it('with invalid cron string. It should throws error', () => {
    expect((done) => {
        cron('smsms')
            .subscribe({
                next(item) { expect(item).toEqual(1); },
                complete() { done(); }
            });
    }).toThrowError();
});

it('Success case. It should return utc mili timestamp', (done) => {
    cron('* * * * * *')
        .subscribe((time) => {
            expect(isNumeric(time)).toBe(true);
            done();
        })
});
