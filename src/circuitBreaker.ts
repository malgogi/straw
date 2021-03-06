import {Observable, Operator, OperatorFunction, Subscriber} from "rxjs";

export interface CircuitBreakOptions<T, R> {
    failureThreshold?: number;
    timeoutSeconds?: number;
    fallback: (from: T) => R;
    execute: (from: T) => R;
};

enum CircuitBreakerState {
    ERROR,
    SUCCESS,
};

export function circuitBreaker<T, R>(option: CircuitBreakOptions<T, R>): OperatorFunction<T, R> {
    return function circuitBreakerOperation(source: Observable<T>): Observable<R> {
        return source.lift(new CircuitBreakerOperator(option));
    };
};

class CircuitBreakerOperator<T, R> implements Operator<T, R> {
    option: CircuitBreakOptions<any, any>;

    constructor(option: CircuitBreakOptions<T,R>) {
        this.option = option;
    }

    call(subscriber: Subscriber<R>, source: any): any {
        return source.subscribe(new CircuitBreakerSubscriber(subscriber, this.option));
    }
}

class CircuitBreakerSubscriber<T,R> extends Subscriber<T> {
    option: CircuitBreakOptions<any, any>;
    state: CircuitBreakerState = CircuitBreakerState.SUCCESS;
    failCounter = 0;
    failureThreshold = 1;

    constructor(destination: Subscriber<R>, option: CircuitBreakOptions<T, R>) {
        super(destination);

        this.option = option;
        this.failureThreshold = option.failureThreshold || 1;
        const timeoutSeconds = option.timeoutSeconds || 1;

        setInterval(() => {
            this.state = CircuitBreakerState.SUCCESS;
            this.failCounter = 0;
        }, timeoutSeconds * 1000);

        this.option = option;
    }

    protected _next(x: T) {
        let result;

        if (this.state === CircuitBreakerState.ERROR) {
            result = this.option.fallback(x);
        }

        try {
            result = this.option.execute(x);
        } catch (error) {
            this.failCounter++;

            if(this.failCounter >= this.failureThreshold) {
                this.state = CircuitBreakerState.ERROR;
            }

            this.destination.error(error);
        }

        this.destination.next(result);
    }
}
