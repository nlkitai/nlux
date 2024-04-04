import React, {useEffect, useImperativeHandle, useMemo} from 'react';

const domById: Record<string, HTMLDivElement> = {};

export const StreamContainerComp = (
    props: {id: string},
    ref: React.Ref<{streamChunk: (chunk: string) => void}>,
) => {
    const streamContainer = React.useRef<HTMLDivElement>(null);
    const [nbUpdates, setNbUpdates] = React.useState(0);

    useEffect(() => {
        if (domById[props.id] === undefined) {
            domById[props.id] = document.createElement('div');
        }
    }, []);

    useEffect(() => {
        if (streamContainer.current && domById[props.id] !== undefined) {
            streamContainer.current.appendChild(domById[props.id]);
        }

        return () => {
            if (streamContainer.current && domById[props.id]) {
                streamContainer.current.removeChild(domById[props.id]);
            }
        };
    }, [streamContainer.current === null]);

    useImperativeHandle(ref, () => ({
        streamChunk: (chunk: string) => {
            if (domById[props.id]) {
                domById[props.id].append(
                    // TODO — Handle proper streaming
                    document.createTextNode(chunk)
                );
            }
        },
    }), []);

    useEffect(() => {
        setNbUpdates((prev) => prev + 1);
    }, [streamContainer.current]);

    return (
        <div>
            <div ref={streamContainer} />
            <div>{nbUpdates}</div>
        </div>
    );
}
