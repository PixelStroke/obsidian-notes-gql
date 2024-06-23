const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  target: 'es2020',
  format: 'cjs',
  outfile: 'dist/obsidian-note-api/main.js',
  external: ['obsidian'],
  loader: {
    '.ts': 'ts',
    '.js': 'jsx',
  },
  minify: true,
  legalComments: 'none',
  plugins: [],
}).catch(() => process.exit(1));
