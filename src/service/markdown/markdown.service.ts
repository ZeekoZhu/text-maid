import { Injectable } from '@nestjs/common';
import { defaultRenderOpt, TextTransformer } from '../text-transformer';
import { TextDoc } from '../../model/text-doc';
import MdIt from 'markdown-it';
import hljs from 'highlight.js';
import Slugger from 'github-slugger';
import Mk from '@iktakahiro/markdown-it-katex';

const mdUtils = new MdIt().utils;
const anchorOpt = {
    level: 1,
    slugify(str) {
        const slugger = new Slugger();
        return slugger.slug(str);
    },
};
const tocOptions = {
    includeLevel: [ 1, 2, 3, 4, 5, 6 ],
    containerClass: 'toc',
    markerPattern: /\[TOC]/im,
    containerHeaderHtml: '<div class="toc-container-header">目录</div>',
    slugify: anchorOpt.slugify,
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

const mdOpt = {
    html: true,
    breaks: true,
    linkify: true,
    highlight: codeHighlight,
};
const md = new MdIt(mdOpt)
    .use(require('markdown-it-abbr'))
    .use(require('markdown-it-deflist'))
    .use(require('markdown-it-emoji'))
    .use(require('markdown-it-footnote'))
    .use(require('markdown-it-sup'))
    .use(require('markdown-it-sub'))
    .use(require('markdown-it-mark'))
    .use(require('markdown-it-anchor'), anchorOpt)
    .use(require('markdown-it-table-of-contents'), tocOptions)
    .use(Mk, { throwOnError: false });
md.linkify.set({ fuzzyEmail: false });

@Injectable()
export class MarkdownService implements TextTransformer {
    render(src: string, opt = defaultRenderOpt): TextDoc {
        const html = md.render(src);
        return { source: src, html };
    }
}
