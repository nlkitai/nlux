import {_defaults} from './defaults';
import {cleanUrl, escape} from './helpers';
import type {MarkedOptions} from './MarkedOptions';

/**
 * Renderer
 */
export class _Renderer {
    options: MarkedOptions;

    constructor(options?: MarkedOptions) {
        this.options = options || _defaults;
    }

    blockquote(quote: string): string {
        return `<blockquote>\n${quote}</blockquote>\n`;
    }

    br(): string {
        return '<br>';
    }

    checkbox(checked: boolean): string {
        return '<input '
            + (checked ? 'checked="" ' : '')
            + 'disabled="" type="checkbox">';
    }

    code(code: string, infostring: string | undefined, escaped: boolean): string {
        const lang = (infostring || '').match(/^\S*/)?.[0];

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return '<pre><code>'
                + (escaped ? code : escape(code, true))
                + '</code></pre>\n';
        }

        return '<pre><code class="language-'
            + escape(lang)
            + '">'
            + (escaped ? code : escape(code, true))
            + '</code></pre>\n';
    }

    codespan(text: string): string {
        return `<code>${text}</code>`;
    }

    del(text: string): string {
        return `<del>${text}</del>`;
    }

    em(text: string): string {
        return `<em>${text}</em>`;
    }

    heading(text: string, level: number, raw: string): string {
        // ignore IDs
        return `<h${level}>${text}</h${level}>\n`;
    }

    hr(): string {
        return '<hr>\n';
    }

    html(html: string, block?: boolean): string {
        return html;
    }

    image(href: string, title: string | null, text: string): string {
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;

        let out = `<img src="${href}" alt="${text}"`;
        if (title) {
            out += ` title="${title}"`;
        }
        out += '>';
        return out;
    }

    link(href: string, title: string | null | undefined, text: string): string {
        const cleanHref = cleanUrl(href);
        if (cleanHref === null) {
            return text;
        }
        href = cleanHref;
        let out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    }

    list(body: string, ordered: boolean, start: number | ''): string {
        const type = ordered ? 'ol' : 'ul';
        const startatt = (ordered && start !== 1) ? (' start="' + start + '"') : '';
        return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
    }

    listitem(text: string, task: boolean, checked: boolean): string {
        return `<li>${text}</li>\n`;
    }

    paragraph(text: string): string {
        return `<p>${text}</p>\n`;
    }

    /**
     * span level renderer
     */
    strong(text: string): string {
        return `<strong>${text}</strong>`;
    }

    table(header: string, body: string): string {
        if (body) {
            body = `<tbody>${body}</tbody>`;
        }

        return '<table>\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + body
            + '</table>\n';
    }

    tablecell(content: string, flags: {
        header: boolean;
        align: 'center' | 'left' | 'right' | null;
    }): string {
        const type = flags.header ? 'th' : 'td';
        const tag = flags.align
            ? `<${type} align="${flags.align}">`
            : `<${type}>`;
        return tag + content + `</${type}>\n`;
    }

    tablerow(content: string): string {
        return `<tr>\n${content}</tr>\n`;
    }

    text(text: string): string {
        return text;
    }
}
