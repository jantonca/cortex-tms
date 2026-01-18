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
        src: './src/assets/logo.svg',
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
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' },
        },
      ],
      head: [
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
      ],
    }),
  ],
});
