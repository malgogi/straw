import {Controller, Get} from '@nestjs/common';

@Controller()
export class TestController {
  @Get('/hello')
  private hello(): string {
    return 'Hello world';
  }
}

