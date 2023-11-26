import {Observable} from '../../../../core/bus/observable';
import {ExceptionId} from '../../../../exceptions/exceptions';
import {DataTransferMode, SendInFetchMode, SendInStreamMode} from '../../../../types/adapter';
import {NluxContext} from '../../../../types/context';
import {Message} from '../../../../types/message';
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
    context: NluxContext;
    promptBoxInstance: CompPromptBox;
    conversation: CompConversation;
    messageToSend: string;
    resetPromptBox: (resetTextInput?: boolean) => void;
}) => {
    return () => {
        const outMessageId = conversation.addMessage(
            'out', 'static', new Date(), messageToSend,
        );

        let inMessageId: string | undefined = undefined;

        try {
            //
            // Disable prompt while sending message
            //
            promptBoxInstance.enableTextInput(false);
            promptBoxInstance.setSendButtonStatus('loading');

            //
            // Important: This is where we sent the message
            // When dataTransferMode is 'fetch', the adapter will send the message as a promise.
            // When the dataTransferMode is 'stream', or when the dataTransferMode is not specified, we always send
            // the message along with an observable as a second parameter, and let the adapter decide if it wants to
            // use it or not.
            //
            const observable = new Observable<Message>({replay: true});
            const sentResponse = dataTransferMode === 'fetch'
                ? (context.adapter.send as SendInFetchMode)(messageToSend)
                : (context.adapter.send as SendInFetchMode | SendInStreamMode)(messageToSend, observable);

            // Here we determine if the message was sent as a promise or as an observable
            let messageContentType: MessageContentType;
            if (sentResponse instanceof Promise) {
                observable.complete();
                observable.reset();
                messageContentType = 'promise';
            } else {
                messageContentType = 'stream';
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
            // Handles messages sent as promises:
            // Use case: Fetch adapters
            //
            if (messageContentType === 'promise' && sentResponse) {
                sentResponse.then((promiseContent) => {
                    message.setContent(promiseContent);
                    resetPromptBox(true);
                }).catch((error) => {
                    message.setErrored();
                    conversation.removeMessage(outMessageId);
                    resetPromptBox(false);

                    const exceptionId: ExceptionId = error?.exceptionId ?? 'NX-AD-001';
                    context.exception(exceptionId);
                });
            } else {
                //
                // Handles messages sent as observables:
                // Use case: Websocket adapters
                //
                if (messageContentType === 'stream' && observable) {
                    conversation.markMessageAsStreaming(inMessageId);
                    observable.subscribe({
                        next: (streamContent) => {
                            if (typeof streamContent === 'string') {
                                message.appendContent(streamContent);
                            }
                        },
                        error: (error: any) => {
                            message.setErrored();
                            conversation.removeMessage(outMessageId);
                            conversation.markMessageAsStreaming(inMessageId);
                            resetPromptBox(false);

                            const exceptionId: ExceptionId = error?.exceptionId ?? 'NX-AD-001';
                            context.exception(exceptionId);
                        },
                        complete: () => {
                            message.commitContent();
                            conversation.markMessageAsStreaming(inMessageId);
                            resetPromptBox(true);
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
            resetPromptBox(false);
        }
    };
};
