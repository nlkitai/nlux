import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const footerNote = `<code>nlux</code> is built and maintained by <a href="https://github.com/salmenus" 
target="_blank">Salmen Hichri</a> - Copyright © 2024 All rights reserved.<br />The source code of nlux is licensed 
under <a href="https://www.mozilla.org/en-US/MPL/2.0/" target="_blank">MPL-2.0</a>.`

const config: Config = {
  title: 'nlux',
  tagline: 'The Open-Source Javascript Library To Build Conversational AI Interfaces',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.nlkit.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: 'nlux',

  // GitHub pages deployment config.
  organizationName: 'NL Kit', // Usually your GitHub org/username.
  projectName: 'nlux', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  stylesheets: [
    {
      href: 'https://use.typekit.net/nvv4ips.css',
      rel: 'preload stylesheet',
      as: 'style',
      type: 'text/css',
      crossorigin: 'anonymous',
    }, {
      href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
      rel: 'preload stylesheet',
      as: 'style',
      type: 'text/css',
      crossorigin: 'anonymous',
    }
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          path: './documentation',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v2.x',
            },
            '1.0.15': {
              label: 'v1.x',
              path: 'v1.x',
            },
          },
        },
        blog: false,
        theme: {
          customCss: [
              './src/css/colors.css',
              './src/css/custom.css'
          ],
        },
        googleTagManager: {
          containerId: 'GTM-MSQV9VWM'
        }
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    //
    // Replace with the project's social card
    //
    image: 'images/theme-meta-card.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    //
    // Navigation bar
    //
    navbar: {
      title: 'NLUX',
      logo: {
        alt: 'NLUX Logo',
        src: 'logo/nlux-logo-main.png',
      },
      items: [
        {
          type: 'docsVersionDropdown',
          docId: 'versionDropdown',
          label: 'Versions',
          position: 'left',
        },
        {
          type: 'docSidebar',
          sidebarId: 'learnSidebar',
          position: 'left',
          label: 'Learn',
          className: 'doc-section',
        },
        {
          type: 'docSidebar',
          sidebarId: 'examplesSidebar',
          position: 'left',
          label: 'Examples',
          className: 'doc-section',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
          className: 'doc-section',
        },
        {
          href: 'https://github.com/nluxai/nlux',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@nlux/core',
          label: 'NPM',
          position: 'right',
        },
        {
          href: 'https://discord.gg/SRwDmZghNB',
          label: 'Discord',
          position: 'right',
        },
        {
          href: 'https://nlux.ai',
          label: 'nlux.ai',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Learn',
              to: '/learn/overview',
            },
            {
              label: 'Examples',
              to: '/examples/react-js-ai-chatbot',
            },
            {
              label: 'API',
              to: '/api/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/nluxai/nlux/discussions',
            },
            {
              label: 'Twitter - X',
              href: 'https://x.com/nluxai',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              href: 'https://nlux.ai/blog',
              label: 'Blog',
              target: '_self',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: footerNote,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
