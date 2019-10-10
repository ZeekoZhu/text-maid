import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HtmlProcessorService } from './html-processor/html-processor.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, HtmlProcessorService],
})
export class AppModule {}
