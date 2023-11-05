import {LayoutOptions} from './options/layoutOptions';

export type ExposedConfig = Readonly<{
    adapter: string | null;
    theme: string | null;
    layoutOptions?: LayoutOptions | null;
    promptPlaceholder: string | null;
}>;
