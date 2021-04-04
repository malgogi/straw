import * as request from 'supertest';
import {INestApplication} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {HttpThrottleRequestModule} from './httpThrottleRequestModule';
import {HttpThrottleRequestInterceptor} from './httpThrottleRequest.interceptor';
import {TestController} from './TestController.mock';

const sleep  = (timeoutMillis: number): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, timeoutMillis);
  })
};

describe('HttpThrottleRequestInterceptor', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
        imports: [HttpThrottleRequestModule],
        controllers: [TestController],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalInterceptors(new HttpThrottleRequestInterceptor(2));
    await app.init();
  });

  describe('throttle base test', () => {
    it('second request should returns 429 status code', async (done) => {
      const agent = request(app.getHttpServer());

      await agent.get('/hello').expect(200);
      await agent.get('/hello').expect(429);
      done();
    });

    it('it should returns 200. when time is over', async (done) => {
      const agent = request(app.getHttpServer());

      await agent.get('/hello').expect(200);
      await agent.get('/hello').expect(429);
      await sleep(3000);
      await agent.get('/hello').expect(200);
      await agent.get('/hello').expect(429);

      done();
    });
  });

  afterAll(async () => {
    await app.close();
  });

});
