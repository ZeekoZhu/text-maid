import { TextDoc } from '../model/text-doc';

export interface RenderOption {
    codeHighlight: boolean;
    math: boolean;
}

export const defaultRenderOpt: RenderOption = {
    codeHighlight: true,
    math: true,
};

export interface TextTransformer {
    render(src: string, opt?: RenderOption): TextDoc;
}
