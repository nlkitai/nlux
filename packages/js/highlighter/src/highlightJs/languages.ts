import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lua from 'highlight.js/lib/languages/lua';
import markdown from 'highlight.js/lib/languages/markdown';
import matlab from 'highlight.js/lib/languages/matlab';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import r from 'highlight.js/lib/languages/r';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scala from 'highlight.js/lib/languages/scala';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';

export const languages = {
    javascript,
    typescript,
    xml,
    json,
    css,
    bash,
    powershell,
    markdown,
    yaml,
    sql,
    java,
    php,
    python,
    ruby,
    go,
    kotlin,
    swift,
    rust,
    scala,
    dart,
    r,
    matlab,
    perl,
    lua,
    c,
    cpp,
};

export type LanguageName = keyof typeof languages;

export const languageShortcutToNameMap: Record<string, keyof typeof languages> = {
    js: 'javascript',
    ts: 'typescript',
    jsx: 'javascript',
    tsx: 'typescript',
    html: 'xml',
    html5: 'xml',
    md: 'markdown',
    yml: 'yaml',
    py: 'python',
    rb: 'ruby',
    kt: 'kotlin',
    rs: 'rust',
    sc: 'scala',
};
