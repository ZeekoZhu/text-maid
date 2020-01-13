import { Injectable } from '@nestjs/common';
import AsciiDoctor from 'asciidoctor';
import highlightJsExt from 'asciidoctor-highlight.js';
import katexExt from 'asciidoctor-katex';

import { defaultRenderOpt, TextTransformer } from '../text-transformer';
import { katexOptions } from '../katex-options';

const asciiDoctor = new AsciiDoctor();

const convertOptions = (registry) => ({
    safe: 'safe',
    attributes: {
        icons: 'font',
        stem: 'latexmath',
        toc: 'auto',
        'toc-title': '内容导航',
        toclevels: 5,
        linkattrs: '',
        'caution-caption': '⚠️',
        'important-caption': '‼️',
        'note-caption': '💬',
        'tip-caption': '💡',
        'warning-caption': '🚨',
        'source-highlighter': 'highlightjs-ext',
    },
    'extension_registry': registry,
});

@Injectable()
export class AsciiDocService implements TextTransformer {
    render(src: string, opt = defaultRenderOpt) {
        const registry = asciiDoctor.Extensions.create();
        if (opt.codeHighlight) {
            highlightJsExt.register(registry);
        }
        if (opt.math) {
            katexExt.register(registry, { katexOptions });
        }
        const html = asciiDoctor.convert(src, convertOptions(registry));
        return { source: src, html };
    }
}
