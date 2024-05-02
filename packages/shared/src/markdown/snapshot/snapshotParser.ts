import {SnapshotParser} from '../../types/markdown/snapshotParser';
import {parse} from './snarkdown';

export const createMdSnapshotRenderer: SnapshotParser = (
        root: HTMLElement,
        options,
    ) => {
        const {
            skipCopyToClipboardButton = false,
            openLinksInNewWindow = false,
        } = options || {};

        return (snapshot: string) => {
            const parsedMarkdown = parse(snapshot, {
                openLinksInNewWindow,
            });

            // TODO — Add syntax highlighting, block styles, and copy to clipboard button.

            root.innerHTML = parsedMarkdown;
        };
    }
;
