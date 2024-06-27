import {Component, PropsWithChildren, KeyboardEvent, useEffect, useMemo, useRef, useState} from 'react';
import {attachCopyClickListener} from '@shared/markdown/copyToClipboard/attachCopyClickListener';
import {parseMdSnapshot} from '@shared/markdown/snapshot/snapshotParser';
import {SnapshotParserOptions} from '@shared/types/markdown/snapshotParser';
import {warn} from '@shared/utils/warn';

type MarkdownSnapshotRendererProps = {
    messageUid: string;
    content: string;
    markdownOptions?: SnapshotParserOptions;
    onMarkdownRenderingError?: (error: Error) => void;
    canResubmit?: boolean;
    onResubmit?: (newPrompt: string) => void;
};

const MarkdownSnapshotRendererImpl = (props: MarkdownSnapshotRendererProps) => {
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
        if (markdownContainerRef.current && markdownOptions?.showCodeBlockCopyButton !== false) {
            attachCopyClickListener(markdownContainerRef.current);
        }
    }, [parsedContent, markdownContainerRef.current, markdownOptions?.showCodeBlockCopyButton]);

    const trustedHtml = useMemo(() => {
        return markdownOptions?.htmlSanitizer ? markdownOptions.htmlSanitizer(parsedContent) : parsedContent;
    }, [parsedContent, markdownOptions?.htmlSanitizer]);

    const [isEditing, setIsEditing] = useState(false);
    const handleBlur = () => setIsEditing(false);
    const handleFocus = () => {
        if (props.canResubmit) {
            setIsEditing(true);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (!props.canResubmit) {
            return;
        }

        const newPromptTyped = event.currentTarget.textContent;
        if (!newPromptTyped) {
            return;
        }

        if (event.key === 'Enter' && event.ctrlKey && props.onResubmit) {
            console.log('Resubmitting prompt:');
            console.log(newPromptTyped);

            event.preventDefault();
            const newPrompt = event.currentTarget.textContent;
            props.onResubmit(newPrompt || '');
        }
    }


    return (
        <MarkdownParserErrorBoundary>
            <div className={'nlux-markdownStream-root'}>
                <div
                    className="nlux-markdown-container"
                    ref={markdownContainerRef}
                    dangerouslySetInnerHTML={{__html: trustedHtml}}
                    contentEditable={props.canResubmit}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </MarkdownParserErrorBoundary>
    );
};

class MarkdownParserErrorBoundary extends Component<{
    onMarkdownRenderingError?: (error: Error) => void;
} & PropsWithChildren> {
    state = {hasError: false};

    static getDerivedStateFromError() {
        return {hasError: true};
    }

    componentDidCatch(errorInfo: Error) {
        warn(
            'Markdown rendering error occurred. This could be due to a malformed markdown content, ' +
            'or it could be because the page requires an HTML sanitizer. Please check the error message ' +
            'for more details and consider configuring NLUX with a compatible sanitizer.',
        );

        if (this.props.onMarkdownRenderingError) {
            this.props.onMarkdownRenderingError(errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export const MarkdownSnapshotRenderer = (props: MarkdownSnapshotRendererProps) => {
    return (
        <MarkdownParserErrorBoundary>
            <MarkdownSnapshotRendererImpl {...props}/>
        </MarkdownParserErrorBoundary>
    );
};
