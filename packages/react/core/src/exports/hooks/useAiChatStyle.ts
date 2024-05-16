import {DisplayOptions} from '@nlux/core';
import {CSSProperties, useMemo} from 'react';

export const useAiChatStyle = (displayOptions: DisplayOptions | undefined): CSSProperties => {
    return useMemo(() => {
        const result: CSSProperties = {
            minWidth: '280px',
            minHeight: '280px',
        };

        if (displayOptions?.width) {
            result.width = displayOptions.width;
        }

        if (displayOptions?.height) {
            result.height = displayOptions.height;
        }

        return result;
    }, [displayOptions?.width, displayOptions?.height]);
};
