import { TextDoc } from "../model/text-doc";

export interface TextTransformer {
    render(src: string): TextDoc;
}
