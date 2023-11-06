import { Test, TestingModule } from '@nestjs/testing';
import { PaystatService } from './paystat.service';

describe('PaystatService', () => {
  let service: PaystatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaystatService],
    }).compile();

    service = module.get<PaystatService>(PaystatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
