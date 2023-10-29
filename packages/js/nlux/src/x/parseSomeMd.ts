export const parseSomeMd = (source: string): string => {
    const mdText = source.replace(/\r\n/g, '\n');

    // split by "pre>", skip for code-block and process normal text
    let mdHTML = '';
    let mdCode = mdText.split('pre>');

    for (let i = 0; i < mdCode.length; i++) {
        if (mdCode[i].substr(-2) == '</') {
            mdHTML += '<pre>' + mdCode[i] + 'pre>';
        } else {
            mdHTML += mdCode[i].replace(/(.*)<$/, '$1')
                .replace(/<\/blockquote\>\n<blockquote\>/g, '\n<br>')
                .replace(/<\/blockquote\>\n<br\><blockquote\>/g, '\n<br>')
                .replace(/\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<a href="$2" title="$3">$1</a>')
                .replace(/<http(.*?)\>/gm, '<a href="http$1">http$1</a>')
                .replace(/\[(.*?)\]\(\)/gm, '<a href="$1">$1</a>')
                .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')
                .replace(/\*\*\*(.*)\*\*\*/gm, '<b><em>$1</em></b>')
                .replace(/\*\*(.*)\*\*/gm, '<b>$1</b>')
                .replace(/\*([\w \d]*)\*/gm, '<em>$1</em>')
                .replace(/___(.*)___/gm, '<b><em>$1</em></b>')
                .replace(/__(.*)__/gm, '<u>$1</u>')
                .replace(/_([\w \d]*)_/gm, '<em>$1</em>')
                .replace(/~~(.*)~~/gm, '<del>$1</del>')
                .replace(/\^\^(.*)\^\^/gm, '<ins>$1</ins>')
                .replace(/ +\n/g, '\n<br/>')
                .replace(/\n\s*\n/g, '\n<p>\n')
                .replace(/^ {4,10}(.*)/gm, '<pre><code>$1</code></pre>')
                .replace(/\\([`_\\\*\+\-\.\(\)\[\]\{\}])/gm, '$1');
        }
    }

    return mdHTML.trim();
};
