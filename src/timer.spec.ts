import {timer} from "rxjs";
import {map} from "rxjs/operators";

it('Basic tc', () => {
   expect(1).toBe(1);
});

it('timer spec test', async (done) => {
    timer(0, 100)
        .pipe(map((item) => console.log(item)))
        .subscribe(() => {
            console.log('success');
            done();
        });
});
