import { Injectable } from '@nestjs/common';
import { defaultRenderOpt, TextTransformer } from '../text-transformer';
import { TextDoc } from '../../model/text-doc';
import { markdownItFactory, defaultOption } from "@zeeko-myget/markdown-it-presets";

@Injectable()
export class MarkdownService implements TextTransformer {
    render(src: string, opt = defaultRenderOpt): TextDoc {
        const md = markdownItFactory('article', { ...defaultOption, ...opt });
        const html = md.render(src);
        return { source: src, html };
    }
}
