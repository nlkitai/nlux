import {Observable} from '../../../../core/bus/observable';
import {ExceptionId} from '../../../../exceptions/exceptions';
import {ChatAdapterExtras} from '../../../../types/adapters/chat/chatAdapterExtras';
import {DataTransferMode} from '../../../../types/adapters/chat/chatAdapter';
import {ControllerContext} from '../../../../types/controllerContext';
import {warn} from '../../../../x/warn';
import {CompConversation} from '../../conversation/conversation.model';
import {MessageContentType} from '../../message/message.types';
import {CompPromptBox} from '../../prompt-box/prompt-box.model';

export const submitPromptFactory = ({
    context,
    promptBoxInstance,
    conversation,
    messageToSend,
    resetPromptBox,
    dataTransferMode,
}: {
    dataTransferMode?: DataTransferMode;
    context: ControllerContext;
    promptBoxInstance: CompPromptBox;
    conversation: CompConversation;
    messageToSend: string;
    resetPromptBox: (resetTextInput?: boolean) => void;
}) => {
    return () => {
        const outMessageId = conversation.addMessage(
            'out', 'static', new Date(), messageToSend,
        );

        try {
            //
            // Disable prompt while sending message
            //
            promptBoxInstance.enableTextInput(false);
            promptBoxInstance.setSendButtonStatus('loading');

            //
            // Important: This is where we send the message via the adapter.
            // When both 'stream' and 'fetch' data transfer modes are supported by the adapter, we use the 'stream'.
            // If only one of the two is supported, we use it.
            // If none of the two is supported, we throw an error.
            //
            const adapter = context.adapter;
            let observable: Observable<string> | undefined;
            let sentResponse: Promise<string> | undefined;
            let messageContentType: MessageContentType;
            const supportedDataTransferModes: DataTransferMode[] = [];
            if (typeof adapter.fetchText === 'function') {
                supportedDataTransferModes.push('fetch');
            }

            if (typeof adapter.streamText === 'function') {
                supportedDataTransferModes.push('stream');
            }

            if (supportedDataTransferModes.length === 0) {
                throw new Error(
                    'ChatAdapter does not support any data transfer mode! The provided adapter must implement either '
                    + '`fetchText()` or `streamText()` methods.',
                );
            }

            if (dataTransferMode && !supportedDataTransferModes.includes(dataTransferMode)) {
                throw new Error(
                    `ChatAdapter does not support the requested data transfer mode: ${dataTransferMode}. ` +
                    `The supported data transfer modes for the provided adapter are: `
                    + `${supportedDataTransferModes.join(', ')}`,
                );
            }

            // Set the default data transfer mode based on the adapter's capabilities
            const defaultDataTransferMode = supportedDataTransferModes.length === 1 ?
                supportedDataTransferModes[0] : 'stream';

            const dataTransferModeToUse = dataTransferMode ?? defaultDataTransferMode;
            const extras: ChatAdapterExtras = {
                aiChatProps: context.aiChatProps,
                conversationHistory: conversation.getConversationContentForAdapter(
                    context.aiChatProps?.conversationOptions?.historyPayloadSize,
                ),
            };

            if (dataTransferModeToUse === 'stream') {
                if (!context.adapter.streamText) {
                    throw new Error('Streaming mode requested but adapter does not implement streamText');
                }

                observable = new Observable<string>();
                context.adapter.streamText(messageToSend, observable, extras);
                messageContentType = 'stream';
            } else {
                if (!context.adapter.fetchText) {
                    throw new Error('Fetch mode requested but adapter does not implement fetchText');
                }

                observable = undefined;
                sentResponse = context.adapter.fetchText(messageToSend, extras);
                messageContentType = 'promise';
            }

            // We add the receiving message to the conversation + we track its loading status.
            const inMessageId = conversation.addMessage(
                'in',
                messageContentType,
                new Date(),
            );

            const message = conversation.getMessageById(inMessageId);
            if (!message) {
                throw new Error(`Message with id ${inMessageId} not found`);
            }

            //
            // Emit matching events
            //
            context.emit('messageSent', messageToSend);

            //
            // Handles messages sent as promises:
            // Use case: Fetch adapters
            //
            if (messageContentType === 'promise' && sentResponse) {
                sentResponse.then((promiseContent) => {
                    message.setContent(promiseContent);
                    resetPromptBox(true);

                    // Only add user message to conversation content (used for history, and not displayed) if the
                    // message was sent successfully and a response was received.
                    conversation.updateConversationContent({role: 'user', message: messageToSend});
                    conversation.updateConversationContent({role: 'ai', message: promiseContent});
                    context.emit('messageReceived', promiseContent);
                }).catch((error) => {
                    message.setErrored();
                    conversation.removeMessage(outMessageId);
                    conversation.removeMessage(message.id);
                    resetPromptBox(false);

                    const exceptionId: ExceptionId = error?.exceptionId ?? 'NX-AD-001';
                    context.exception(exceptionId);

                    context.emit('error', {
                        errorId: exceptionId,
                        message: error.message || 'An error occurred while sending message via Promise.',
                    });
                });
            } else {
                //
                // Handles messages sent as observables:
                // Use case: Websocket adapters
                //
                if (messageContentType === 'stream' && observable) {
                    observable.subscribe({
                        next: (streamContent) => {
                            if (typeof streamContent === 'string') {
                                message.appendContent(streamContent);
                            }
                        },
                        error: (error: any) => {
                            message.setErrored();
                            conversation.removeMessage(outMessageId);
                            conversation.removeMessage(message.id);
                            resetPromptBox(false);

                            const exceptionId: ExceptionId = error?.exceptionId ?? 'NX-AD-001';
                            context.exception(exceptionId);

                            context.emit('error', {
                                errorId: exceptionId,
                                message: error.message || 'An error occurred while sending message via Observable.',
                            });
                        },
                        complete: () => {
                            message.commitContent();
                            resetPromptBox(true);

                            if (message.content) {
                                // Only add user message to conversation content (used for history, and not displayed)
                                // if the message was sent successfully and a response was received.
                                conversation.updateConversationContent({role: 'user', message: messageToSend});
                                conversation.updateConversationContent({role: 'ai', message: message.content});
                                context.emit('messageReceived', message.content);
                            }
                        },
                    });
                } else {
                    // Not supposed to happen
                    throw new Error(
                        `Message sent with unknown type or data source - Message type: ${messageContentType}`,
                    );
                }
            }
        } catch (error) {
            warn(error);
            resetPromptBox(false);
        }
    };
};
