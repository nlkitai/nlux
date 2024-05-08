import {_defaults} from './defaults';
import type {MarkedOptions} from './MarkedOptions';
import type {Token, TokensList} from './Tokens';

export class _Hooks {
    static passThroughHooks = new Set([
        'preprocess',
        'postprocess',
        'processAllTokens',
    ]);
    options: MarkedOptions;

    constructor(options?: MarkedOptions) {
        this.options = options || _defaults;
    }

    /**
     * Process HTML after marked is finished
     */
    postprocess(html: string) {
        return html;
    }

    /**
     * Process markdown before marked
     */
    preprocess(markdown: string) {
        return markdown;
    }

    /**
     * Process all tokens before walk tokens
     */
    processAllTokens(tokens: Token[] | TokensList) {
        return tokens;
    }
}
