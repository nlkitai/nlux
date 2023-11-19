import {SequenceParser} from '../../utils/md/sequenceParser';
import {MarkdownElementName} from './markdownElement';

export interface MarkdownProcessorInterface {

    get canExistAtRootLevel(): boolean;
    createElement(): HTMLElement;
    get domElement(): HTMLElement | undefined;
    init(): void;
    get markdownElementName(): MarkdownElementName;
    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none';
    get parsingChild(): MarkdownProcessorInterface | undefined;
    parsingChildYielded(
        child: MarkdownProcessorInterface,
        elementToCreateAtParentLevel?: MarkdownElementName,
        characterToAppendToParentLevel?: string,
    ): void;
    preProcessCharacter(character: string): void;
    processCharacter(character: string): void;
    purgeSequence(): void;
    recreatedSequenceParser(): void;
    get removeWhenEmpty(): boolean;
    get sequenceParser(): SequenceParser;
    setParsingChild(child: MarkdownProcessorInterface): void;
    yield(): void | never;
    get yielded(): boolean;
}
