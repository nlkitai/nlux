import {SequenceParser} from '../../exports/aiChat/markdown/sequenceParser';
import {MarkdownElementName} from './markdownElement';

export interface MarkdownProcessorInterface {

    get canExistAtRootLevel(): boolean;
    createElement(openingSequence?: string): HTMLElement;
    get domElement(): HTMLElement | undefined;
    init(): void;
    get markdownElementName(): MarkdownElementName;
    get nestedMarkdownElements(): MarkdownElementName[] | 'all' | 'none';
    get parsingChild(): MarkdownProcessorInterface | undefined;
    parsingChildYielded(
        child: MarkdownProcessorInterface,
        elementToCreateAtParentLevel?: MarkdownElementName,
        openingSequence?: string,
        characterToAppendToParentLevel?: string,
    ): void;
    preProcessCharacter(character: string): void;
    processCharacter(character: string): void;
    purgeSequence(): void;
    get removeWhenEmpty(): boolean;
    resetSequenceParser(): void;
    get sequenceParser(): SequenceParser;
    setParsingChild(child: MarkdownProcessorInterface): void;
    yield(): void | never;
    get yielded(): boolean;
}
