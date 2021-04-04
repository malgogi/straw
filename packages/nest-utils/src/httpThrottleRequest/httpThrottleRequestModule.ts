import {Module} from '@nestjs/common';
import {HttpThrottleRequestInterceptor} from './httpThrottleRequest.interceptor';

@Module({
  imports: [HttpThrottleRequestInterceptor],
  exports: [HttpThrottleRequestInterceptor],
})
export class HttpThrottleRequestModule {}
