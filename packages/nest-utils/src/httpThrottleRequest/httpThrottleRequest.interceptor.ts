import {CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Moment} from 'moment';
import moment = require('moment');

@Injectable()
export class HttpThrottleRequestInterceptor implements NestInterceptor {
  private handlerNameMap: { [name: string]: Moment } = {};

  constructor(private throttleSeconds: number = 10) {}

  private static determineHandlerName(context: ExecutionContext): string | null {
    return context.getHandler().name;
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const name = HttpThrottleRequestInterceptor.determineHandlerName(context);

    if (!name) {
      return ;
    }

    const previous = this.handlerNameMap[name];
    if (previous && previous.isAfter(moment().subtract(this.throttleSeconds, 'seconds'))) {
      throw new HttpException('Too many Request', 429);
    }

    this.handlerNameMap[name] = moment();
    return next
      .handle();
  }
}
