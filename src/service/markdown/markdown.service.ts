import { Injectable } from '@nestjs/common';
import { TextTransformer } from "../text-transformer";
import { TextDoc } from "../../model/text-doc";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import MarkdownItContainer from "markdown-it-container";
import MdAbbr from 'markdown-it-abbr';
import MdDefList from 'markdown-it-deflist';
import MdEmoji from 'markdown-it-emoji';
import MdFootnote from 'markdown-it-footnote';
import MdMark from 'markdown-it-mark';
import MdSub from 'markdown-it-sub';
import MdSup from 'markdown-it-sup';

const mdOpt: MarkdownIt.Options = {
    html: true,
    breaks: true,
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (__) {
            }
        }

        return ''; // use external default escaping
    }
};

const md = new MarkdownIt(mdOpt)
    .use(MarkdownItContainer)
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
