import {useMemo} from 'react';
import {parseMdSnapshot} from '../../../../../shared/src/markdown/snapshot/snapshotParser';
import {SnapshotParserOptions} from '../../../../../shared/src/types/markdown/snapshotParser';

export const MarkdownSnapshotRenderer = (props: {
    messageUid: string,
    content: string,
    markdownOptions?: SnapshotParserOptions,
}) => {
    const {markdownOptions} = props;
    const parsedContent = useMemo(() => {
        if (!props.content) {
            return '';
        }

        return parseMdSnapshot(props.content, markdownOptions);
    }, [props.content, markdownOptions?.openLinksInNewWindow, markdownOptions?.syntaxHighlighter]);

    return (
        <div className={'nlux-md-strm-root'}>
            <div className="nlux-md-cntr" dangerouslySetInnerHTML={{__html: parsedContent}}/>
        </div>
    );
};
