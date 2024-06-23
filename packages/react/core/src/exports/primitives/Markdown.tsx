import {useContext, useMemo} from 'react';
import {primitivesContext} from '../hooks/usePrimitivesContext';
import {MarkdownSnapshotRenderer} from '../../sections/MessageRenderer/MarkdownSnapshotRenderer';

/**
 * A primitive to parse markdown using the same parser as the one used in markdown streams.
 * This will also generate the appropriate HTML tags for code blocks and syntax highlighting.
 *
 * @param children
 */
export const Markdown = ({children}: MarkdownProps) => {
    const uid = useMemo(() => Math.random().toString(36).substring(7), []);
    const primitivesContextData = useContext(primitivesContext);
    const childrenAsString = Array.isArray(children) ? children.join('') : children;
    return (
        <MarkdownSnapshotRenderer
            markdownOptions={primitivesContextData.messageOptions}
            content={childrenAsString}
            messageUid={uid}
        />
    );
};

export type MarkdownProps = {
    /**
     * The markdown content to be parsed, provided as a string or an array of strings
     * inside the component.
     */
    children: string | Array<string>;
};
