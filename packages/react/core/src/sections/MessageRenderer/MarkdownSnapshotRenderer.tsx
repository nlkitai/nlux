import {isSubmitShortcutKey} from '@shared/utils/isSubmitShortcutKey';
import {Component, PropsWithChildren, KeyboardEvent, FocusEvent, useEffect, useMemo, useRef, useState, useCallback} from 'react';
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
    submitShortcutKey?: 'Enter' | 'CommandEnter';
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

    const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
        if (!props.canResubmit) {
            return;
        }

        const newPromptTyped = event.currentTarget.textContent;
        if (!newPromptTyped) {
            return;
        }

        if (isSubmitShortcutKey(event, props.submitShortcutKey)) {
            event.preventDefault();
            if (props.onResubmit) {
                props.onResubmit(newPromptTyped);
            }

            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            event.currentTarget.textContent = props.content;
            event.currentTarget.blur();
        }
    }, [props.canResubmit, props.onResubmit, props.content]);

    const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
        if (!props.canResubmit) {
            return;
        }

        event.preventDefault();
        event.currentTarget.textContent = props.content;
        event.currentTarget.blur();
    }, [props.canResubmit, props.content]);

    const handleFocus = useCallback((event: FocusEvent<HTMLDivElement>) => {
        if (!props.canResubmit) {
            return;
        }

        event.preventDefault();
        // Select all text when the user focuses on the content
        const range = document.createRange();
        range.selectNodeContents(event.currentTarget);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);

    }, [props.canResubmit]);

    const editableStyle = props.canResubmit ? 'editable-markdown-container' : '';

    return (
        <MarkdownParserErrorBoundary>
            <div className={`nlux-markdownStream-root ${editableStyle}`}>
                <div
                    className={`nlux-markdown-container`}
                    ref={markdownContainerRef}
                    dangerouslySetInnerHTML={{__html: trustedHtml}}
                    contentEditable={props.canResubmit}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
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
