import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import sanity from '@sanity/astro';
import { presentationTool } from 'sanity/presentation'


// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      tailwindcss(),
      presentationTool({
        previewUrl: {
          initial: 'https://my-cool-site.com',
          previewMode: {
            enable: '/api/draft-mode/enable',
            disable: '/api/draft-mode/disable',
          },
        },
        allowOrigins: ['http://localhost:*'],
      }),
    ]
  },

  integrations: [
    react(),
    sanity({
      projectId: "8u96f8y2",
      dataset: "production",
      useCdn: false,
    })
  ],
});