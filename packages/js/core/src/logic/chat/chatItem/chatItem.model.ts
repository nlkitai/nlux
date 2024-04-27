import {BaseComp} from '../../../exports/aiChat/comp/base';
import {CompEventListener, Model} from '../../../exports/aiChat/comp/decorators';
import {HighlighterExtension} from '../../../exports/aiChat/highlighter/highlighter';
import {ControllerContext} from '../../../types/controllerContext';
import {renderChatItem} from './chatItem.render';
import {CompChatItemActions, CompChatItemElements, CompChatItemEvents, CompChatItemProps} from './chatItem.types';
import {updateChatItem} from './chatItem.update';

@Model('chatItem', renderChatItem, updateChatItem)
export class CompChatItem<AiMsg> extends BaseComp<
    AiMsg, CompChatItemProps, CompChatItemElements, CompChatItemEvents, CompChatItemActions
> {
    constructor(
        context: ControllerContext<AiMsg>,
        props: CompChatItemProps,
    ) {
        super(context, props);
    }

    public addChunk(chunk: string) {
        this.throwIfDestroyed();
        this.executeDomAction('processStreamedChunk', chunk);
    }

    public commitChunks() {
        this.throwIfDestroyed();
        // TODO - implement chunking
    }

    public updateMarkdownStreamRenderer(
        newProp: keyof CompChatItemProps,
        newValue: CompChatItemProps[typeof newProp],
    ) {
        this.setProp(newProp, newValue);

        if (newProp === 'syntaxHighlighter') {
            const typedNewValue = newValue as HighlighterExtension | undefined;
            this.executeDomAction('updateMarkdownStreamRenderer', {
                syntaxHighlighter: typedNewValue,
            } satisfies Partial<CompChatItemProps>);
        }
    }

    @CompEventListener('markdown-stream-complete')
    private onMarkdownStreamComplete(messageRendered: AiMsg) {
        this.context.emit('messageRendered', {
            uid: this.props.uid,
        });
    }
}
