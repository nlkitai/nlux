export default `.my-theme.nlux-AiChat-root.nlux-theme-nova {
  /* Override top-level chat room colors */
  --nlux-ChatRoom--BackgroundColor: #0c0c0e;
  --nlux-ChatRoom--BorderColor: #24233d;
  --nlux-ChatRoom-Divider--Color: #24233d;
  --nlux-ChatRoom--BorderWidth: 2px;

  /* Override message bubble colors */
  --nlux-AiMessage--BackgroundColor: #00BFFF;
  --nlux-HumanMessage--BackgroundColor: #DC143C;

  /* Override border radius */
  --nlux-ChatRoom--BorderRadius: 5px;
  --nlux-ChatItem-Avatar--BorderRadius: 5px;
  --nlux-ChatItem-Message-BubbleLayout--BorderRadius: 5px;
  --nlux-PromptInput--BorderRadius: 5px;
  --nlux-SubmitButton--BorderRadius: 5px;
  
  /* Override input colors */
  --nlux-PromptInput--BackgroundColor: #161620;
  --nlux-PromptInput-Active--BackgroundColor: #161620;
  --nlux-PromptInput-Disabled--BackgroundColor: #161620;
 
  /* Override submit button colors */
  --nlux-SubmitButton--BackgroundColor: #161620;
  --nlux-SubmitButton-Active--BackgroundColor: #24233d;
  --nlux-SubmitButton-Disabled--BackgroundColor: #161620;

  /* Override icon for the send button */
  --nlux-send-icon: url('data:image/svg+xml,\\
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" \\
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\\
      <circle cx="12" cy="12" r="10"/>\\
      <path d="M16 12l-4-4-4 4M12 16V9"/>\\
    </svg>\\
  ');

  /* Gap between submit button and input */
  --nlux-Composer--Gap: 8px;
}
`;
