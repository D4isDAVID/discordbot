import { build } from 'esbuild';
import { writeFile } from 'fs/promises';

/** @type {Record<string, import('esbuild').BuildOptions>} */
const environments = {
    server: {
        platform: 'node',
        target: ['node16'],
        format: 'cjs',
    },
};

for (const [context, options] of Object.entries(environments)) {
    await build({
        bundle: true,
        entryPoints: [`${context}/index.ts`],
        outfile: `dist/${context}.js`,
        keepNames: true,
        treeShaking: true,
        ...options,
    });
}

await writeFile('.yarn.installed', new Date().toISOString());
