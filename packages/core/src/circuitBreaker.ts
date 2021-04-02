import {Observable, Operator, OperatorFunction, Subscriber} from 'rxjs';
import moment = require('moment');

export interface CircuitBreakOption<T, R> {
    failureThreshold?: number;
    timeoutSeconds?: number;
    fallback: (from: T) => Promise<R> | R;
    execute: (from: T) => Promise<R> | R;
}

enum CircuitBreakerState {
    ERROR,
    SUCCESS,
}

export function circuitBreaker<T, R>(option: CircuitBreakOption<T, R>): OperatorFunction<T, R> {
    return function circuitBreakerOperation(source: Observable<T>): Observable<R> {
        return source.lift(new CircuitBreakerOperator(option));
    };
}

class CircuitBreakerOperator<T, R> implements Operator<T, R> {
    option: CircuitBreakOption<any, any>;

    constructor(option: CircuitBreakOption<T,R>) {
        this.option = option;
    }

    call(subscriber: Subscriber<R>, source: any): any {
        return source.subscribe(new CircuitBreakerSubscriber(subscriber, this.option));
    }
}

class CircuitBreakerSubscriber<T,R> extends Subscriber<T> {
    private option: CircuitBreakOption<any, any>;
    private state: CircuitBreakerState = CircuitBreakerState.SUCCESS;
    private readonly failureThreshold;
    private readonly timeoutSeconds;
    private failCounter = 0;
    private taskCounter = 0;
    private startTime;

    constructor(destination: Subscriber<R>, option: CircuitBreakOption<T, R>) {
        super(destination);
        this.option = option;
        this.failureThreshold = option.failureThreshold || 1;
        this.timeoutSeconds = option.timeoutSeconds || 1;
    }

    private reset() {
        this.state = CircuitBreakerState.SUCCESS;
        this.startTime = moment();
        this.failCounter = 0;
    }

    protected async _next(x: T) {
        this.taskCounter++;

        if (!this.startTime) {
            this.startTime = moment();
        }

        if (moment.duration(moment().diff(this.startTime)).asSeconds() > this.timeoutSeconds) {
            this.reset();
        }

        if (this.state === CircuitBreakerState.ERROR) {
            this.destination.next(await this.option.fallback(x));
            this.taskCounter--;
            return ;
        }

        let result;
        try {
            result = await this.option.execute(x);
            this.reset();
        } catch (error) {
            this.failCounter++;

            if(this.failCounter >= this.failureThreshold) {
                this.state = CircuitBreakerState.ERROR;
            }

            result = await this.option.fallback(x);
        }

        this.destination.next(result);
        this.taskCounter--;
    }

    protected _complete() {
      const interval = setInterval(() => {
        if (this.taskCounter === 0) {
          clearInterval(interval);
          this.destination.complete();
        }
      }, 100);
    }
}
