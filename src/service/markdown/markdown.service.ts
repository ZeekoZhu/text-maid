import { Injectable } from '@nestjs/common';
import { TextTransformer } from '../text-transformer';
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
import uslug from 'uslug';

const mdOpt: MarkdownIt.Options = {
    html: true,
    breaks: true,
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                const result = hljs.highlight(lang, str, true);
                return `<pre class="hljs"><code data-lang="${result.language}">` +
                    result.value +
                    '</code></pre>';
            } catch (__) {
            }
        }

        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    },
};

const anchorOpt: MdAnchor.AnchorOptions = {
    slugify: uslug,
    level: 6
};

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

@Injectable()
export class MarkdownService implements TextTransformer {
    render(src: string): TextDoc {
        const html = md.render(src);
        return { source: src, html };
    }
}
