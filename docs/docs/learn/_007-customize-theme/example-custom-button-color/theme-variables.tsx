export default `.nlux-theme-MyBrandName[data-color-scheme='light'] {
    --nlux-ChatRoom--BackgroundColor: #f9f9f9;
}

.nlux-theme-MyBrandName[data-color-scheme='dark'] {
    --nlux-ChatRoom--BackgroundColor: #060524;
}

.nlux-theme-MyBrandName {

    /* Override top-level chat room colors */
    --nlux-ChatRoom--BorderColor: #24233d;
    --nlux-ChatRoom-Divider--Color: #24233d;
    --nlux-ChatRoom--TextColor: #ffffff;

    /* Override message bubble colors */
    --nlux-AiMessage--BackgroundColor: #00bfff;
    --nlux-HumanMessage--BackgroundColor: #dc143c;

    /* Override border width */
    --nlux-ChatRoom--BorderWidth: 0;
    --nlux-SubmitButton--BorderWidth: 0;
    --nlux-PromptInput--BorderWidth: 0;
    --nlux-ChatItem-Avatar--BorderWidth: 0;
    --nlux-ChatItem-Message-BubbleLayout--BorderWidth: 0;
    --nlux-ConversationStarter--BorderWidth: 0;

    /* Override border radius */
    --nlux-ChatRoom--BorderRadius: 5px;
    --nlux-PromptInput--BorderRadius: 5px 0 0 5px;
    --nlux-SubmitButton--BorderRadius: 0 5px 5px 0;
    --nlux-ChatItem-Avatar--BorderRadius: 5px;
    --nlux-ChatItem-Message-BubbleLayout--BorderRadius: 5px;
    --nlux-ConversationStarter--BorderRadius: 5px;

    /* Override input colors */
    --nlux-PromptInput--BackgroundColor: #24233d;
    --nlux-PromptInput-Active--BackgroundColor: #24233d;
    --nlux-PromptInput-Disabled--BackgroundColor: #24233d;

    /* Gap between submit button and input */
    --nlux-Composer--Gap: 0;

    /* Override submit button colors */
    --nlux-SubmitButton--BackgroundColor: #24233d;
    --nlux-SubmitButton-Active--BackgroundColor: #24233d;
    --nlux-SubmitButton-Disabled--BackgroundColor: #24233d;

    /* Conversation starter colors */
    --nlux-ConversationStarter--BackgroundColor: #24233d;

    /* Override icon for the send button */
    --nlux-send-icon: url('data:image/svg+xml,\\
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" \\
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\\
      <circle cx="12" cy="12" r="10"/>\\
      <path d="M16 12l-4-4-4 4M12 16V9"/>\\
    </svg>\\
  ');
}
`;
