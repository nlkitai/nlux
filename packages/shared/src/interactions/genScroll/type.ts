export type GenScrollHandler = {
    updateProps: ({scrollWhenGenerating}: {scrollWhenGenerating: boolean}) => void;
    updateConversationContainer: (container: HTMLElement) => void;
    handleNewChatSegmentAdded: (sectionId: string, sectionContainer: HTMLElement) => void;
    handleChatSegmentComplete: (sectionId: string) => void;
    handleChatSegmentRemoved: (sectionId: string) => void;
    destroy: () => void;
};
