import {ConversationDisplayMode} from '@nlux/core';

export const conversationDisplayModeClassName: {[key: string]: string} = {
    bubbles: 'nlux_cht_itm_bbl',
    list: 'nlux_cht_itm_lst',
};

export const applyNewDisplayModeClassName = (element: HTMLElement, displayMode: ConversationDisplayMode) => {
    const displayModes = Object.keys(conversationDisplayModeClassName);
    displayModes.forEach((displayModeName) => {
        element.classList.remove(conversationDisplayModeClassName[displayModeName]);
    });

    if (conversationDisplayModeClassName[displayMode]) {
        element.classList.add(conversationDisplayModeClassName[displayMode]);
    }
};
