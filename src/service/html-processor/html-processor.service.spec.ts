import { Test, TestingModule } from '@nestjs/testing';
import { HtmlProcessorService } from './html-processor.service';

describe('HtmlProcessorService', () => {
  let service: HtmlProcessorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtmlProcessorService],
    }).compile();

    service = module.get<HtmlProcessorService>(HtmlProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
