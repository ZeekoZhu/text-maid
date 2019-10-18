import { Module } from '@nestjs/common';
import { TextController } from './contorller/text.controller';
import { AppService } from './app.service';
import { HtmlProcessorService } from './service/html-processor/html-processor.service';
import { MarkdownService } from './service/markdown/markdown.service';
import { AsciiDocService } from './service/asciidoc/asciidoc.service';
import { MathController } from './contorller/math.controller';
import { CodeController } from './contorller/code.controller';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './service/terminus-options.service';

@Module({
    imports: [
        TerminusModule.forRootAsync({
            useClass: TerminusOptionsService,
        }),
    ],
    controllers: [TextController, MathController, CodeController],
    providers: [AppService, HtmlProcessorService, MarkdownService, AsciiDocService],
})
export class AppModule {
}
