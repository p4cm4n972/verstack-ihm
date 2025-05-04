const { writeFileSync } = require('fs');
const { join } = require('path');
const { version } = require('../../package.json');

const buildDate = new Date().toLocaleDateString('fr-FR');
const filePath = join(__dirname, '..', '..', 'version.ts');

const content = `
export const APP_VERSION = '${version}';
export const BUILD_DATE = '${buildDate}';
`;

writeFileSync(filePath, content.trim() + '\n');
console.log(`✅ Version ${version} enregistrée dans version.ts`);
