import { Body, Controller, Post } from '@nestjs/common';
import hljs from 'highlight.js';

@Controller('api/code')
export class CodeController {
    @Post('highlight')
    highlight(@Body('text') src: string, @Body('lang') lang: string) {
        const result = hljs.highlight(lang, src, true);
        return result.value;
    }
}
