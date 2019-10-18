import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';

export function diagramPlugin(md: MarkdownIt, options: any) {

    function getLangName(info: string): string {
        return info.split(/\s+/g)[0];
    }

    // Store reference to original renderer.
    let defaultFenceRenderer = md.renderer.rules.fence;

    function customFenceRenderer(tokens: Token[], idx: number, options: any, env: any, slf: any) {
        let token = tokens[idx];
        let info = token.info.trim();
        let langName = info ? getLangName(info) : '';

        if (langName.toLowerCase() === 'mermaid') {
            return '<div class="mermaid">' + md.utils.escapeHtml(token.content) + '</div>';
        }
        return defaultFenceRenderer(tokens, idx, options, env, slf);
    }

    md.renderer.rules.fence = customFenceRenderer;
}
