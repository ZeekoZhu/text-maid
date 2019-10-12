import { Module } from '@nestjs/common';
import { TextController } from './text.controller';
import { AppService } from './app.service';
import { HtmlProcessorService } from './service/html-processor/html-processor.service';
import { MarkdownService } from './service/markdown/markdown.service';
import { AsciiDocService } from './service/asciidoc/asciidoc.service';

@Module({
    imports: [],
    controllers: [TextController],
    providers: [AppService, HtmlProcessorService, MarkdownService, AsciiDocService],
})
export class AppModule {
}
