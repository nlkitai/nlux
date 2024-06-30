import {ChatSegmentItem} from '@shared/types/chatSegment/chatSegment';
import {FunctionComponent, MutableRefObject, ReactNode, RefObject, useEffect} from 'react';
import {ChatItemImperativeProps} from '../ChatItem/props';

export const useItemsRefs = <AiMsg>(
    chatSegmentItems: ChatSegmentItem<AiMsg>[],
    serverComponentsRef: MutableRefObject<Map<string, ReactNode>>,
    serverComponentsFunctionsRef: MutableRefObject<Map<string, FunctionComponent>>,
    chatItemsRef: Map<string, RefObject<ChatItemImperativeProps<AiMsg>>>,
) => {
    useEffect(() => {
        if (chatSegmentItems.length === 0) {
            chatItemsRef.clear();
            serverComponentsRef.current.clear();
            serverComponentsFunctionsRef.current.clear();
            return;
        }

        const itemsInRefsMap = new Set<string>(chatItemsRef.keys());
        const itemsInSegments = new Set<string>(chatSegmentItems.map((item) => item.uid));
        itemsInRefsMap.forEach((itemInRefsMap) => {
            if (!itemsInSegments.has(itemInRefsMap)) {
                chatItemsRef.delete(itemInRefsMap);
            }
        });

        const serverComponentsInRefsMap = new Set<string>(serverComponentsRef.current.keys());
        serverComponentsInRefsMap.forEach((itemInRefsMap) => {
            if (!itemsInSegments.has(itemInRefsMap)) {
                serverComponentsRef.current.delete(itemInRefsMap);
                serverComponentsFunctionsRef.current.delete(itemInRefsMap);
            }
        });
    }, [chatSegmentItems]);
};
