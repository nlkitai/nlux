/* eslint-disable no-use-before-define */
export type Token = (
    Tokens.Space
    | Tokens.Code
    | Tokens.Heading
    | Tokens.Table
    | Tokens.Hr
    | Tokens.Blockquote
    | Tokens.List
    | Tokens.ListItem
    | Tokens.Paragraph
    | Tokens.HTML
    | Tokens.Text
    | Tokens.Def
    | Tokens.Escape
    | Tokens.Tag
    | Tokens.Image
    | Tokens.Link
    | Tokens.Strong
    | Tokens.Em
    | Tokens.Codespan
    | Tokens.Br
    | Tokens.Del
    | Tokens.Generic);

export namespace Tokens {
    export interface Space {
        raw: string;
        type: 'space';
    }

    export interface Code {
        codeBlockStyle?: 'indented' | undefined;
        escaped?: boolean;
        lang?: string | undefined;
        raw: string;
        text: string;
        type: 'code';
    }

    export interface Heading {
        depth: number;
        raw: string;
        text: string;
        tokens: Token[];
        type: 'heading';
    }

    export interface Table {
        align: Array<'center' | 'left' | 'right' | null>;
        header: TableCell[];
        raw: string;
        rows: TableCell[][];
        type: 'table';
    }

    export interface TableCell {
        text: string;
        tokens: Token[];
    }

    export interface Hr {
        raw: string;
        type: 'hr';
    }

    export interface Blockquote {
        raw: string;
        text: string;
        tokens: Token[];
        type: 'blockquote';
    }

    export interface List {
        items: ListItem[];
        loose: boolean;
        ordered: boolean;
        raw: string;
        start: number | '';
        type: 'list';
    }

    export interface ListItem {
        checked?: boolean | undefined;
        loose: boolean;
        raw: string;
        task: boolean;
        text: string;
        tokens: Token[];
        type: 'list_item';
    }

    export interface Paragraph {
        pre?: boolean | undefined;
        raw: string;
        text: string;
        tokens: Token[];
        type: 'paragraph';
    }

    export interface HTML {
        block: boolean;
        pre: boolean;
        raw: string;
        text: string;
        type: 'html';
    }

    export interface Text {
        raw: string;
        text: string;
        tokens?: Token[];
        type: 'text';
    }

    export interface Def {
        href: string;
        raw: string;
        tag: string;
        title: string;
        type: 'def';
    }

    export interface Escape {
        raw: string;
        text: string;
        type: 'escape';
    }

    export interface Tag {
        block: boolean;
        inLink: boolean;
        inRawBlock: boolean;
        raw: string;
        text: string;
        type: 'text' | 'html';
    }

    export interface Link {
        href: string;
        raw: string;
        text: string;
        title?: string | null;
        tokens: Token[];
        type: 'link';
    }

    export interface Image {
        href: string;
        raw: string;
        text: string;
        title: string | null;
        type: 'image';
    }

    export interface Strong {
        raw: string;
        text: string;
        tokens: Token[];
        type: 'strong';
    }

    export interface Em {
        raw: string;
        text: string;
        tokens: Token[];
        type: 'em';
    }

    export interface Codespan {
        raw: string;
        text: string;
        type: 'codespan';
    }

    export interface Br {
        raw: string;
        type: 'br';
    }

    export interface Del {
        raw: string;
        text: string;
        tokens: Token[];
        type: 'del';
    }

    export interface Generic {
        raw: string;
        tokens?: Token[] | undefined;
        type: string;
        [index: string]: any;
    }
}

export type Links = Record<string, Pick<Tokens.Link | Tokens.Image, 'href' | 'title'>>;

export type TokensList = Token[] & {
    links: Links;
};
