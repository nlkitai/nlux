export default (colorScheme: 'light' | 'dark') => `` +
`<div style="position:absolute; top: 0; bottom: 0; right: 0; left: 0; padding: 20px; background-color: ` +
    `${colorScheme === 'dark' ? '#151515' : '#fff'}">` +
    `<div id="root" style="width: 100%; height: 100%;"></div></div>`;
