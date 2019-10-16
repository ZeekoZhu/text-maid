import { Injectable } from '@nestjs/common';
import { defaultRenderOpt, RenderOption, TextTransformer } from '../text-transformer';
import { TextDoc } from '../../model/text-doc';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import MarkdownItContainer from 'markdown-it-container';
import MdAbbr from 'markdown-it-abbr';
import MdDefList from 'markdown-it-deflist';
import MdEmoji from 'markdown-it-emoji';
import MdFootnote from 'markdown-it-footnote';
import MdMark from 'markdown-it-mark';
import MdSub from 'markdown-it-sub';
import MdSup from 'markdown-it-sup';
import MdAnchor from 'markdown-it-anchor';
import MdKatex from '@iktakahiro/markdown-it-katex';
import uslug from 'uslug';
import { katexOptions } from '../katex-options';

const mdUtils = new MarkdownIt().utils;

const anchorOpt: MdAnchor.AnchorOptions = {
    level: 1,
    slugify: str => uslug(str),
};

const codeHighlight = (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
        try {
            const result = hljs.highlight(lang, str, true);
            return `<pre class="hljs"><code data-lang="${result.language}">` +
                result.value +
                '</code></pre>';
        } catch (__) {
        }
    }
    return '<pre class="hljs"><code>' + mdUtils.escapeHtml(str) + '</code></pre>';
};

const mdFactory = (opt: RenderOption) => {
    const mdOpt: MarkdownIt.Options = {
        html: true,
        breaks: true,
        linkify: true,
    };

    if (opt.codeHighlight) {
        mdOpt.highlight = codeHighlight;
    }

    const md = new MarkdownIt(mdOpt)
        .use(MarkdownItContainer)
        .use(MdAnchor, anchorOpt)
        .use(MdAbbr)
        .use(MdDefList)
        .use(MdEmoji)
        .use(MdFootnote)
        .use(MdMark)
        .use(MdSub)
        .use(MdSup);

    if (opt.math) {
        md.use(MdKatex, katexOptions);
    }
    return md;
};

@Injectable()
export class MarkdownService implements TextTransformer {
    render(src: string, opt = defaultRenderOpt): TextDoc {
        const md = mdFactory(opt);
        const html = md.render(src);
        return { source: src, html };
    }
}