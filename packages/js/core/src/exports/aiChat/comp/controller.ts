export interface CompController<CompProps = any> {
    control: (comp: HTMLElement) => void;
    release: () => void;
    update: (props: CompProps) => void;
}
