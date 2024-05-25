import {AiChat, ChatItem} from '@nlux-dev/react/src';
import {render} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {adapterBuilder} from '../../../../utils/adapterBuilder';
import {AdapterController} from '../../../../utils/adapters';
import {waitForMilliseconds, waitForReactRenderCycle} from '../../../../utils/wait';

describe('<AiChat /> + initialConversation prop', () => {
    let adapterController: AdapterController | undefined;

    beforeEach(() => {
        adapterController = adapterBuilder().withBatchText().create();
    });

    afterEach(() => {
        adapterController = undefined;
    });

    describe('When the component is created with an initialConversation', () => {
        it('The initial conversation should be loaded in the chat', async () => {
            // Arrange
            const initialConversation: ChatItem<string>[] = [
                {role: 'assistant', message: 'Hello, how can I help you?'},
                {role: 'user', message: 'I need help with my account.'},
                {role: 'assistant', message: 'Sure, I can help you with that.'},
            ];

            const aiChat = <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>;
            render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            const incomingMessages = aiChatDom.querySelectorAll('.nlux_msg_incoming');
            expect(incomingMessages.length).toBe(2);
            expect(incomingMessages[0].textContent).toEqual(expect.stringContaining('Hello, how can I help you?'));
            expect(incomingMessages[1].textContent).toEqual(expect.stringContaining('Sure, I can help you with that.'));
        });

        it('The initial conversation should be loaded instantly without typing animation', async () => {
            // Arrange
            const initialConversation: ChatItem<string>[] = [
                {
                    role: 'assistant',
                    message: 'Hello, how can I help you? This is going to be a very long greeting message. '
                        + 'It is so long that it will be split into multiple lines. It will also showcase that no '
                        + 'typing animation will be shown for this message when it is loaded. This is a very long '
                        + 'message. Trust me.\n'
                        + 'In a message, long and true,\n'
                        + 'Words kept flowing, never few.\n'
                        + 'Stories told with heartfelt grace,\n'
                        + 'In each line, a sacred space.\n\n'
                        + 'Each word a bridge, connecting souls,\n'
                        + 'Across distances, making us whole.\n'
                        + 'Emotions poured, thoughts unfurled,\n'
                        + 'In this message, a treasure world.\n\n'
                        + 'Pages filled with hopes and dreams,\n'
                        + 'In this message, it truly seems,\n'
                        + 'That connection can transcend the miles,\n'
                        + 'In this message, love it files.\n'
                        + 'So let us embrace this lengthy tale,\n'
                        + 'For in its depth, we will prevail.\n'
                        + 'For in a message, long and grand,\n'
                        + 'We find connection, hand in hand.',
                },
                {role: 'user', message: 'I need help with my account.'},
            ];

            const aiChat = <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>;
            render(aiChat);
            await waitForReactRenderCycle();

            // Act
            const aiChatDom = document.querySelector('.nlux-AiChat-root')!;

            // Assert
            const incomingMessage = aiChatDom.querySelector('.nlux_msg_incoming')!;
            expect(incomingMessage.textContent).toEqual(expect.stringContaining('Hello, how can I help you?'));
            expect(incomingMessage.textContent).toEqual(expect.stringContaining('We find connection, hand in hand'));
        });

        it('The scroll should be at the bottom of the chat', async () => {
            // Arrange
            const initialConversation: ChatItem<string>[] = [
                {
                    role: 'assistant',
                    message: 'Hello, how can I help you? This is going to be a very long greeting message. '
                        + 'It is so long that it will be split into multiple lines. It will also showcase that no '
                        + 'typing animation will be shown for this message when it is loaded. This is a very long '
                        + 'message. Trust me.\n'
                        + 'In a message, long and true,\n'
                        + 'Words kept flowing, never few.\n'
                        + 'Stories told with heartfelt grace,\n'
                        + 'In each line, a sacred space.\n\n'
                        + 'Each word a bridge, connecting souls,\n'
                        + 'Across distances, making us whole.\n'
                        + 'Emotions poured, thoughts unfurled,\n'
                        + 'In this message, a treasure world.\n\n'
                        + 'Pages filled with hopes and dreams,\n'
                        + 'In this message, it truly seems,\n'
                        + 'That connection can transcend the miles,\n'
                        + 'In this message, love it files.\n'
                        + 'So let us embrace this lengthy tale,\n'
                        + 'For in its depth, we will prevail.\n'
                        + 'For in a message, long and grand,\n'
                        + 'We find connection, hand in hand.',
                },
                {role: 'user', message: 'I need help with my account.'},
                {role: 'assistant', message: 'Sure, I can help you with that.'},
            ];

            const aiChat = <AiChat
                displayOptions={{
                    height: 200,
                }}
                adapter={adapterController!.adapter}
                initialConversation={initialConversation}
            />;

            // Act
            render(aiChat);
            await waitForMilliseconds(200);
            const aiChatRoomDom = document.querySelector('.nlux-chtRm-cnv-cntr')!;

            // Assert
            expect(aiChatRoomDom?.scrollTo).toHaveBeenCalledWith({behavior: 'smooth', top: 50000});
        });

        describe('When the initial conversation contains markdown', () => {
            it('Should be parsed and rendered', async () => {
                // Arrange
                const initialConversation: ChatItem<string>[] = [
                    {role: 'assistant', message: '**Hello**, how can I help you?'},
                    {role: 'user', message: 'I need help with my account.'},
                    {role: 'assistant', message: 'Sure, I can help you with that.'},
                ];

                // Act
                const aiChat = <AiChat adapter={adapterController!.adapter} initialConversation={initialConversation}/>;
                render(aiChat);
                await waitForReactRenderCycle();

                // Assert
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
                const incomingMessages = aiChatDom.querySelectorAll('.nlux_msg_incoming');
                expect(incomingMessages.length).toBe(2);
                expect(incomingMessages[0].innerHTML).toEqual(
                    expect.stringContaining('<strong>Hello</strong>, how can I help you?'));
                expect(incomingMessages[1].textContent).toEqual(
                    expect.stringContaining('Sure, I can help you with that.'));
            });
        });

        describe('When the initial conversation contains a code block', () => {
            it('Should be parsed and rendered', async () => {
                // Arrange
                const initialConversation: ChatItem<string>[] = [
                    {
                        role: 'assistant',
                        message: 'This is hello worlds in JS:\n```javascript\nconsole.log("Hello World!");\n```',
                    },
                    {role: 'user', message: 'I need it in Python'},
                    {role: 'assistant', message: 'Sure, here it is:\n```python\nprint("Hello World!")\n```'},
                ];

                // Act
                const aiChat = (
                    <AiChat
                        adapter={adapterController!.adapter}
                        initialConversation={initialConversation}
                        messageOptions={{
                            showCodeBlockCopyButton: false
                        }}
                    />
                );
                render(aiChat);
                await waitForReactRenderCycle();

                // Assert
                const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
                const incomingMessages = aiChatDom.querySelectorAll('.nlux_msg_incoming .nlux-md-cntr');
                expect(incomingMessages.length).toBe(2);
                expect(incomingMessages[0].innerHTML).toEqual(
                    expect.stringContaining(
                        '<p>This is hello worlds in JS:</p>\n'
                        + '<div class="code-block"><pre data-language="javascript"><div>console.log("Hello World!");\n'
                        + '</div></pre></div>\n',
                    ),
                );
                expect(incomingMessages[1].innerHTML).toEqual(
                    expect.stringContaining(
                        '<p>Sure, here it is:</p>\n'
                        + '<div class="code-block"><pre data-language="python"><div>print("Hello World!")\n'
                        + '</div></pre></div>\n',
                    ),
                );
            });

            describe('When markdownLinkTarget is set to false', () => {
                it('Should open links in the same window', async () => {
                    // Arrange
                    const initialConversation: ChatItem<string>[] = [
                        {
                            role: 'assistant',
                            message: 'This is a [link](http://example.com)',
                        },
                        {role: 'user', message: 'I need help with my account.'},
                        {role: 'assistant', message: 'Sure, I can help you with that.'},
                    ];

                    // Act
                    const aiChat = <AiChat
                        adapter={adapterController!.adapter}
                        initialConversation={initialConversation}
                        messageOptions={{markdownLinkTarget: 'self'}}
                    />;
                    render(aiChat);
                    await waitForReactRenderCycle();

                    // Assert
                    const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
                    const link = aiChatDom.querySelector('a')!;
                    expect(link.getAttribute('target')).toBeNull();
                });
            });

            describe('When markdownLinkTarget is set to true', () => {
                it('Should open links in a new window', async () => {
                    // Arrange
                    const initialConversation: ChatItem<string>[] = [
                        {
                            role: 'assistant',
                            message: 'This is a [link](http://example.com)',
                        },
                        {role: 'user', message: 'I need help with my account.'},
                        {role: 'assistant', message: 'Sure, I can help you with that.'},
                    ];

                    // Act
                    const aiChat = <AiChat
                        adapter={adapterController!.adapter}
                        initialConversation={initialConversation}
                        messageOptions={{markdownLinkTarget: 'blank'}}
                    />;
                    render(aiChat);
                    await waitForReactRenderCycle();

                    // Assert
                    const aiChatDom = document.querySelector('.nlux-AiChat-root')!;
                    const link = aiChatDom.querySelector('a')!;
                    expect(link.getAttribute('target')).toBe('_blank');
                });
            });
        });
    });
});
