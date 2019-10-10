import { Injectable } from '@nestjs/common';
import { TextDoc } from "../../model/text-doc";
import cheerio from 'cheerio';
import { uniq } from 'lodash-es';

@Injectable()
export class HtmlProcessorService {
    process(doc: TextDoc) {
        const $ = cheerio.load(doc.html, { xmlMode: true, decodeEntities: false });
        const codeBlocks = $('pre code[data-lang]');
        const languages = uniq(codeBlocks.map((_, el) => $(el).data('lang')).toArray());
    }
}
