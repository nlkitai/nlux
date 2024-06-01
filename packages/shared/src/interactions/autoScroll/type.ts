export type AutoScrollController = {
    updateProps: ({autoScroll}: { autoScroll: boolean }) => void;
    updateConversationContainer: (container: HTMLElement) => void;
    handleNewChatSegmentAdded: (segmentId: string, segmentContainer: HTMLElement) => void;
    handleChatSegmentComplete: (segmentId: string) => void;
    handleChatSegmentRemoved: (segmentId: string) => void;
    destroy: () => void;
};
