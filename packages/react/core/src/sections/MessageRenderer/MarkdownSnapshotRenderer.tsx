import {useEffect, useMemo, useRef} from 'react';
import {attachCopyClickListener} from '@shared/markdown/copyToClipboard/attachCopyClickListener';
import {parseMdSnapshot} from '@shared/markdown/snapshot/snapshotParser';
import {SnapshotParserOptions} from '@shared/types/markdown/snapshotParser';

export const MarkdownSnapshotRenderer = (props: {
    messageUid: string,
    content: string,
    markdownOptions?: SnapshotParserOptions,
}) => {
    const {markdownOptions} = props;
    const markdownContainerRef = useRef<HTMLDivElement>(null);

    const parsedContent = useMemo(() => {
        if (!props.content) {
            return '';
        }

        return parseMdSnapshot(props.content, {
            syntaxHighlighter: markdownOptions?.syntaxHighlighter,
            htmlSanitizer: markdownOptions?.htmlSanitizer,
            markdownLinkTarget: markdownOptions?.markdownLinkTarget,
            showCodeBlockCopyButton: markdownOptions?.showCodeBlockCopyButton,
        });
    }, [
        props.content, markdownOptions?.markdownLinkTarget, markdownOptions?.syntaxHighlighter,
        markdownOptions?.htmlSanitizer, markdownOptions?.showCodeBlockCopyButton,
    ]);

    useEffect(() => {
        if (markdownContainerRef.current && markdownOptions?.showCodeBlockCopyButton) {
            attachCopyClickListener(markdownContainerRef.current);
        }
    }, [parsedContent, markdownContainerRef.current, markdownOptions?.showCodeBlockCopyButton]);

    const trustedHtml = useMemo(() => {
        return markdownOptions?.htmlSanitizer ? markdownOptions.htmlSanitizer(parsedContent) : parsedContent;
    }, [parsedContent, markdownOptions?.htmlSanitizer]);

    return (
        <div className={'nlux-md-strm-root'}>
            <div
                className="nlux-md-cntr"
                ref={markdownContainerRef}
                dangerouslySetInnerHTML={{__html: trustedHtml}}
            />
        </div>
    );
};
