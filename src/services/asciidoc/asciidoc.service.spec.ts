import { Test, TestingModule } from '@nestjs/testing';
import { AsciiDocService } from './asciidoc.service';

describe('AsciiDocService', () => {
  let service: AsciiDocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AsciiDocService],
    }).compile();

    service = module.get<AsciiDocService>(AsciiDocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
