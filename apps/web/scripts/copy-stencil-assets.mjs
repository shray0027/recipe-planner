import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourceDirectory = join(scriptDirectory, '../node_modules/@shray0027/recipe-ui/dist/esm');
const targetDirectory = join(scriptDirectory, '../static/recipe-ui');

mkdirSync(targetDirectory, { recursive: true });

for (const entry of readdirSync(sourceDirectory)) {
	cpSync(join(sourceDirectory, entry), join(targetDirectory, entry), { recursive: true });
}
