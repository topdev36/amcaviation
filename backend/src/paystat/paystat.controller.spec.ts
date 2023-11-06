import { Test, TestingModule } from '@nestjs/testing';
import { PaystatController } from './paystat.controller';

describe('PaystatController', () => {
  let controller: PaystatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaystatController],
    }).compile();

    controller = module.get<PaystatController>(PaystatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
