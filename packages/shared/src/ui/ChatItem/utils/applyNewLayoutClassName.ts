import {ConversationLayout} from '@nlux/core';

export const conversationLayoutClassName: {[key: string]: string} = {
    bubbles: 'nlux_cht_itm_bbl',
    list: 'nlux_cht_itm_lst',
};

export const applyNewLayoutClassName = (element: HTMLElement, layout: ConversationLayout) => {
    const layouts = Object.keys(conversationLayoutClassName);
    layouts.forEach((layoutName) => {
        element.classList.remove(conversationLayoutClassName[layoutName]);
    });

    if (conversationLayoutClassName[layout]) {
        element.classList.add(conversationLayoutClassName[layout]);
    }
};
