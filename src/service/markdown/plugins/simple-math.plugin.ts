import MarkdownIt from 'markdown-it';
import StateInline from 'markdown-it/lib/rules_inline/state_inline';
import StateBlock from 'markdown-it/lib/rules_block/state_block';
import { RuleBlock } from 'markdown-it/lib';

// Test if potential opening or closing delimiter
// Assumes that there is a "$" at state.src[pos]
function isValidDelimiter(state: StateInline, pos: number) {
    let max = state.posMax;
    let canOpen = true;
    let canClose = true;

    let prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1;
    let nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1; // Check non-whitespace conditions for opening and closing, and // check that closing delimiter isn't followed by a number
    if (prevChar === 0x20/* " " */ || prevChar === 0x09/* \t */ ||
        (nextChar >= 0x30/* "0" */ && nextChar <= 0x39/* "9" */)) {
        canClose = false;
    }
    if (nextChar === 0x20/* " " */ || nextChar === 0x09/* \t */) {
        canOpen = false;
    }

    return {
        canOpen,
        canClose,
    };
}

const mathInline: MarkdownIt.RuleInline = (state, silent) => {
    let start, match, token, res, pos;

    if (state.src[state.pos] !== '$') {
        return false;
    }

    res = isValidDelimiter(state, state.pos);
    if (!res.canOpen) {
        if (!silent) {
            state.pending += '$';
        }
        state.pos += 1;
        return true;
    }

    // First check for and bypass all properly escaped delimiters
    // This loop will assume that the first leading backtick can not
    // be the first character in state.src, which is known since
    // we have found an opening delimiter already.
    start = state.pos + 1;
    match = start;
    while ((match = state.src.indexOf('$', match)) !== -1) {
        // Found potential $, look for escapes, pos will point to
        // first non escape when complete
        pos = match - 1;
        while (state.src[pos] === '\\') {
            pos -= 1;
        }

        // Even number of escapes, potential closing delimiter found
        if (((match - pos) % 2) == 1) {
            break;
        }
        match += 1;
    }

    // No closing delimiter found.  Consume $ and continue.
    if (match === -1) {
        if (!silent) {
            state.pending += '$';
        }
        state.pos = start;
        return true;
    }

    // Check if we have empty content, ie: $$.  Do not parse.
    if (match - start === 0) {
        if (!silent) {
            state.pending += '$$';
        }
        state.pos = start + 1;
        return true;
    }

    // Check for valid closing delimiter
    res = isValidDelimiter(state, match);
    if (!res.can_close) {
        if (!silent) {
            state.pending += '$';
        }
        state.pos = start;
        return true;
    }

    if (!silent) {
        token = state.push('math_inline', 'math', 0);
        token.markup = '$';
        token.content = state.src.slice(start, match);
    }

    state.pos = match + 1;
    return true;
};

const mathBlock = (state: StateBlock, start: number, end: number, silent?: boolean) => {
    let lastLine;
    let next;
    let lastPos;
    let found = false;
    let token;
    let pos = state.bMarks[start] + state.tShift[start];
    let max = state.eMarks[start];

    if (pos + 2 > max) {
        return false;
    }

    if (state.src[pos] !== '$' || state.src[pos + 1] !== '$') {
        return false;
    }

    pos += 2;
    if (silent) {
        return true;
    }

    let firstLine = state.src.slice(pos, max);
    if (firstLine.trim().slice(-2) === '$$') {
        // Single line expression
        firstLine = firstLine.trim().slice(0, -2);
        found = true;
    }

    for (next = start; !found;) {

        next++;

        if (next >= end) {
            break;
        }

        pos = state.bMarks[next] + state.tShift[next];
        max = state.eMarks[next];

        if (pos < max && state.tShift[next] < state.blkIndent) {
            // non-empty line with negative indent should stop the list:
            break;
        }

        if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
            lastPos = state.src.slice(0, max).lastIndexOf('$$');
            lastLine = state.src.slice(pos, lastPos);
            found = true;
        }

    }

    state.line = next + 1;

    token = state.push('math_block', 'math', 0);
    token.block = true;
    token.content = (firstLine && firstLine.trim() ? firstLine + '\n' : '')
        + state.getLines(start + 1, next, state.tShift[start], true)
        + (lastLine && lastLine.trim() ? lastLine : '');
    token.map = [start, state.line];
    token.markup = '$$';
    return true;
};

export const simpleMathPlugin = (md: MarkdownIt) => {

    md.inline.ruler.after('escape', 'math_inline', mathInline);
    md.block.ruler.after('blockquote', 'math_block', mathBlock as any, {
        alt: ['paragraph', 'reference', 'blockquote', 'list'],
    });

    const simpleInlineRenderer: MarkdownIt.TokenRender = (tokens, idx) => {
        return '<span class="math inline">\\(' + md.utils.escapeHtml(tokens[idx].content) + '\\)</span>';
    };

    const simpleBlockRenderer: MarkdownIt.TokenRender = (tokens, idx) => {
        return '<p><div class="math display">\\[' + md.utils.escapeHtml(tokens[idx].content) + '\\]</div></p>';
    };

    md.renderer.rules.math_inline = simpleInlineRenderer;
    md.renderer.rules.math_block = simpleBlockRenderer;

};
