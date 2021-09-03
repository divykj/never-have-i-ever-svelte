import { optimizeImports } from 'carbon-preprocess-svelte';
import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    target: '#svelte',
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/never-have-i-ever-svelte' : ''
    },
    prerender: {
      enabled: process.env.NODE_ENV === 'production'
    },
    ssr: false,
    adapter: adapter({ fallback: 'index.html' })
  },
  preprocess: [optimizeImports()]
};
