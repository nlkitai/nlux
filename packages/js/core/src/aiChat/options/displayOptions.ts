export type DisplayOptions = {
    /**
     * The theme ID to use.
     * This should be the ID of a theme that has been loaded into the page.
     */
    themeId?: string;

    /**
     * Color scheme for the component.
     * This can be 'light', 'dark', or 'auto'.
     *
     * If 'auto' is used, the component will automatically switch between 'light' and 'dark' based on the user's
     * operating system preferences (if it can be detected), otherwise it will default to 'light'.
     *
     * @default 'auto'
     */
    colorScheme?: 'light' | 'dark' | 'auto';

    /**
     * The width of the component.
     */
    width?: number | string;

    /**
     * The height of the component.
     */
    height?: number | string;
};
