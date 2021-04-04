import {Observable} from 'rxjs';
import * as moment from 'moment';
const nodeCron = require('node-cron');

export function cron(period = ''): Observable<number> {
    if (typeof period !== 'string') {
        throw new Error('Invalid type of period');
    }

    if(!nodeCron.validate(period)) {
        throw new Error('Invalid period');
    }

    return new Observable(observer => {
        nodeCron.schedule(period, () => {
            observer.next(moment().unix());
        });
    });
}
