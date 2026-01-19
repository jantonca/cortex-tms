import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'fs';

// Import root package.json for version sync
const rootPkg = JSON.parse(readFileSync('../package.json', 'utf-8'));

// https://astro.build/config
export default defineConfig({
  site: 'https://cortex-tms.org',
  integrations: [
    starlight({
      title: 'Cortex TMS',
      description: 'AI-powered project scaffolding for documentation and workflow automation',
      logo: {
        light: './src/assets/logo.svg',
        dark: './src/assets/logo-dark.svg',
        alt: 'Cortex TMS Logo',
      },
      social: {
        github: 'https://github.com/cortex-tms/cortex-tms',
      },
      editLink: {
        baseUrl: 'https://github.com/cortex-tms/cortex-tms/edit/main/website/',
      },
      customCss: [
        '@fontsource-variable/noto-sans',
        '@fontsource-variable/noto-serif',
        '@fontsource/noto-sans-mono',
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'Blog',
          link: '/blog/',
          badge: { text: 'New', variant: 'success' },
        },
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', link: '/getting-started/introduction/' },
            { label: 'Installation', link: '/getting-started/installation/' },
            { label: 'Quick Start', link: '/getting-started/quick-start/' },
          ],
        },
        {
          label: 'Core Concepts',
          collapsed: true,
          autogenerate: { directory: 'concepts' },
        },
        {
          label: 'Guides',
          collapsed: true,
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'CLI Reference',
          collapsed: true,
          autogenerate: { directory: 'reference/cli' },
        },
        {
          label: 'Use Cases',
          collapsed: true,
          autogenerate: { directory: 'use-cases' },
        },
        {
          label: 'Comparisons',
          collapsed: true,
          autogenerate: { directory: 'comparisons' },
        },
        {
          label: 'Troubleshooting',
          collapsed: true,
          autogenerate: { directory: 'troubleshooting' },
        },
        {
          label: 'Community',
          collapsed: true,
          items: [
            { label: 'Known Issues', link: '/community/known-issues/' },
            { label: 'Changelog', link: '/community/changelog/' },
            { label: 'Contributing', link: '/community/contributing/' },
          ],
        },
      ],
      lastUpdated: true,
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon.png',
          },
        },
        {
          tag: 'link',
          attrs: {
            rel: 'alternate',
            type: 'application/rss+xml',
            title: 'Cortex TMS Blog',
            href: '/rss.xml',
          },
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: '/og-image.png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        },
        {
          tag: 'script',
          attrs: {
            src: '/external-links.js',
          },
        },
      ],
    }),
  ],
});
