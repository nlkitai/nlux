import {LayoutOptions} from '@nlux/core';
import {CSSProperties, useMemo} from 'react';

export const useAiChatStyle = (layoutOptions: LayoutOptions | undefined): CSSProperties => {
    return useMemo(() => {
        const result: CSSProperties = {
            minWidth: '280px',
            minHeight: '280px',
        };

        if (layoutOptions?.width) {
            result.width = layoutOptions.width;
        }

        if (layoutOptions?.height) {
            result.height = layoutOptions.height;
        }

        return result;
    }, [layoutOptions?.width, layoutOptions?.height]);
};
