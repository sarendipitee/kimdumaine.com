// @ts-check
import { defineConfig } from 'astro/config';

// GH Pages serves this repo at sarendipitee.github.io/kimdumaine.com/ — that
// path prefix only applies to that one deploy target, so it's opted into via
// env var (set in .github/workflows/deploy.yml) rather than baked in here.
// Any other static host gets the default root-relative build out of the box.
const ghPages = process.env.GH_PAGES === 'true';

// https://astro.build/config
export default defineConfig({
  ...(ghPages && {
    site: 'https://sarendipitee.github.io',
    base: '/kimdumaine.com/',
  }),
});
