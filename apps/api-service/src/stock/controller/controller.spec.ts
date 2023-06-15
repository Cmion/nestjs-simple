import { Test, TestingModule } from '@nestjs/testing';
import { ApiServiceController } from '.';
import { ApiServiceService } from '../service';

describe('ApiServiceController', () => {
  let apiServiceController: ApiServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiServiceController],
      providers: [ApiServiceService],
    }).compile();

    apiServiceController = app.get<ApiServiceController>(ApiServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apiServiceController.getHello()).toBe('Hello World!');
    });
  });
});
