import {Markdown} from './markdown';
import {asterisk1} from './markdowns/asterisk1';
import {asterisk2} from './markdowns/asterisk2';
import {backtick} from './markdowns/backtick';
import {backtick3} from './markdowns/backtick3';
import {defaultMarkdown} from './markdowns/defaultMarkdown';
import {header1} from './markdowns/header1';
import {header2} from './markdowns/header2';
import {header3} from './markdowns/header3';
import {underscore1} from './markdowns/underscore1';
import {underscore2} from './markdowns/underscore2';

export type TagName = 'h1' | 'h2' | 'h3' |
    'p' | 'code' | 'pre' |
    'br' | 'hr' |
    'strong' | 'em' | 'del'
    | 'a' | 'img' | 'url' |
    'ul' | 'ol' | 'li' |
    'blockquote';

export const MarkdownsByTagName = new Map<TagName, Markdown[]>([
    ['p', [defaultMarkdown]],
    ['h1', [header1]],
    ['h2', [header2]],
    ['h3', [header3]],
    ['code', [backtick]],
    ['pre', [backtick3]],
    ['em', [asterisk1, underscore1]],
    ['strong', [asterisk2, underscore2]],
]);

export const defaultTagName = 'p';
