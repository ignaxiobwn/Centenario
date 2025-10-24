const fs = require('fs');
const path = require('path');

// Ajusta este valor si la carpeta de imágenes tiene otro nombre. Recomendado: evitar espacios en nombres (e.g. fts-centenario)
const IMAGES_ROOT = process.env.IMAGES_ROOT || 'fts centenario';
const OUT_FILE = process.env.OUT_FILE || 'list.json';

function isDir(p){
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function walkRoot(root){
  const result = {};
  if (!fs.existsSync(root)) return result;
  const entries = fs.readdirSync(root);

  const rootFiles = [];
  entries.forEach(e => {
    const full = path.join(root, e);
    try {
      const stat = fs.statSync(full);
      if (stat.isDirectory()){
        const files = fs.readdirSync(full).filter(f => {
          try { return fs.statSync(path.join(full,f)).isFile(); } catch(e){ return false }
        }).filter(f => !f.startsWith('.'));
        result[e] = files.sort();
      } else if (stat.isFile()){
        if (!e.startsWith('.')) rootFiles.push(e);
      }
    } catch(err){ /* ignore broken entries */ }
  });

  if (rootFiles.length) result['Otras Fotografías'] = rootFiles.sort();
  return result;
}

function main(){
  const data = walkRoot(IMAGES_ROOT);
  fs.writeFileSync(OUT_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Wrote ${OUT_FILE} with folders: ${Object.keys(data).join(', ')}`);
}

main();