import {ChatSegmentItem} from '../../../../../../shared/src/types/chatSegment/chatSegment';
import {ChatItemProps} from '../../../../../../shared/src/ui/ChatItem/props';
import {domOp} from '../../../../../../shared/src/utils/dom/domOp';
import {warnOnce} from '../../../../../../shared/src/utils/warn';
import {BaseComp} from '../../../exports/aiChat/comp/base';
import {comp} from '../../../exports/aiChat/comp/comp';
import {CompEventListener, Model} from '../../../exports/aiChat/comp/decorators';
import {ControllerContext} from '../../../types/controllerContext';
import {CompChatItem} from '../chatItem/chatItem.model';
import {CompChatItemProps} from '../chatItem/chatItem.types';
import {renderChatSegment} from './chatSegment.render';
import {
    CompChatSegmentActions,
    CompChatSegmentElements,
    CompChatSegmentEvents,
    CompChatSegmentProps,
} from './chatSegment.types';
import {updateChatSegment} from './chatSegment.update';
import {getChatItemPropsFromSegmentItem} from './utils/getChatItemProps';

@Model('chatSegment', renderChatSegment, updateChatSegment)
export class CompChatSegment<AiMsg> extends BaseComp<
    AiMsg, CompChatSegmentProps, CompChatSegmentElements, CompChatSegmentEvents, CompChatSegmentActions
> {
    private chatItems: Map<string, CompChatItem<AiMsg>> = new Map();

    constructor(
        context: ControllerContext<AiMsg>,
        props: CompChatSegmentProps,
    ) {
        super(context, props);
    }

    public addChatItem(item: ChatSegmentItem<AiMsg>) {
        this.throwIfDestroyed();
        if (this.chatItems.has(item.uid)) {
            throw new Error(`CompChatSegment: chat item with id "${item.uid}" already exists`);
        }

        let compChatItemProps: ChatItemProps | undefined = getChatItemPropsFromSegmentItem(item);
        // TODO - Add additional props
        // loader / name / picture

        if (!compChatItemProps) {
            throw new Error(`CompChatSegment: chat item with id "${item.uid}" has invalid props`);
        }

        const newChatItemComp = comp(CompChatItem<AiMsg>)
            .withContext(this.context)
            .withProps({
                    uid: item.uid,
                    domProps: compChatItemProps,
                } satisfies CompChatItemProps,
            )
            .create();

        this.chatItems.set(item.uid, newChatItemComp);

        if (!this.rendered) {
            // If the chat segment is not rendered, we don't need to render the chat item yet!
            return;
        }

        if (!this.renderedDom?.elements?.chatSegmentContainer) {
            warnOnce('CompChatSegment: chatSegmentContainer is not available');
            return;
        }

        newChatItemComp.render(
            this.renderedDom.elements.chatSegmentContainer,
            this.renderedDom.elements.loaderContainer,
        );
    }

    public addChunk(chatItemId: string, chunk: string) {
        domOp(() => {
            if (this.destroyed) {
                return;
            }

            const chatItem = this.chatItems.get(chatItemId);
            if (!chatItem) {
                throw new Error(`CompChatSegment: chat item with id "${chatItemId}" not found`);
            }

            chatItem.addChunk(chunk);
        });
    }

    public complete() {
        this.throwIfDestroyed();
        this.chatItems.forEach((comp) => comp.commitChunks());
        this.setProp('status', 'complete');
    }

    destroy() {
        this.chatItems.forEach((comp) => comp.destroy());
        this.chatItems.clear();
        super.destroy();
    }

    @CompEventListener('chat-segment-ready')
    private onChatSegmentReady() {
        domOp(() => {
            if (!this.renderedDom?.elements?.chatSegmentContainer) {
                return;
            }

            const chatSegmentContainer = this.renderedDom?.elements?.chatSegmentContainer;
            this.chatItems.forEach((comp) => {
                if (!comp.rendered) {
                    comp.render(chatSegmentContainer);
                }
            });
        });
    }

    @CompEventListener('loader-hidden')
    private onLoaderHidden() {
        if (this.renderedDom?.elements) {
            this.renderedDom.elements.loaderContainer = undefined;
        }
    }

    @CompEventListener('loader-shown')
    private onLoaderShown(loader: HTMLElement) {
        if (this.renderedDom?.elements) {
            this.renderedDom.elements.loaderContainer = loader;
        }
    }
}
