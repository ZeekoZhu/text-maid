import { Body, Controller, Post, Res } from '@nestjs/common';
import { MarkdownService } from './service/markdown/markdown.service';
import { AsciiDocService } from './service/asciidoc/asciidoc.service';
import { TextTransformer } from './service/text-transformer';
import { Response } from 'express';
import { errorMsg } from './model/error-msg';

export enum TextType {
    Markdown, AsciiDoc
}

export class RenderRequest {
    text: string;
    type: TextType;
}

@Controller('text')
export class TextController {
    constructor(private mdRenderer: MarkdownService, private asciiDocRenderer: AsciiDocService) {
    }

    @Post('render')
    markdown(@Body() renderReq: RenderRequest, @Res() res: Response) {
        let renderer: TextTransformer;
        switch (renderReq.type) {
            case TextType.Markdown:
                renderer = this.mdRenderer;
                break;
            case TextType.AsciiDoc:
                renderer = this.asciiDocRenderer;
                break;
            default:
                res.status(400).send(errorMsg([`Unsupported text type: ${renderReq.type}`]));
                break;
        }
        const doc = renderer.render(renderReq.text);
        res.status(200).send(doc);
    }
}
