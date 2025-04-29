const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public/assets/images');
const outputFile = path.join(__dirname, 'public/assets/frameworks.json');

function formatName(fileName) {
  return fileName
    .replace(/\.(png|jpg|jpeg|svg|webp)$/i, '') // Remove extension
    .replace(/[-_]/g, ' ')                      // Replace separators with spaces
    .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
}

fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Erreur de lecture du dossier images:', err);
    return;
  }

  const frameworks = files
    .filter(file => /\.(png|jpg|jpeg|svg|webp)$/i.test(file))
    .map(file => ({
      name: formatName(file),
      logo: `assets/images/${file}`
    }));

  fs.writeFileSync(outputFile, JSON.stringify(frameworks, null, 2));
  console.log(`✅ Fichier généré : ${outputFile}`);
});
