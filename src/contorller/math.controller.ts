import { Body, Controller, Post } from '@nestjs/common';
import katex from 'katex';
import { katexOptions } from '../service/katex-options';

@Controller('api/math')
export class MathController {
    @Post('render')
    render(@Body('text') text: string, @Body('inline') isInlineMode: boolean) {
        return katex.renderToString(text, { ...katexOptions, displayMode: !isInlineMode });
    }
}
