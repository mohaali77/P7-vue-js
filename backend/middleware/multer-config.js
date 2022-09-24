//permet de facilité la gestion des fichiers entrant dans les requêtes http
const multer = require('multer');

//dictionnaire de mime_types
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  //on demande a multer d'enregistrer les fichiers dans le dossiers image
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    //on supprime les espaces dans le nom des fichiers et on les remplace par des _
    const name = file.originalname.split(' ').join('_');
    //on ajoute l'extension MIME_TYPES à la fin du fichier
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//on exporte multer et on lui indique qu'on souhaite gérer uniquement les téléchargement d'image
module.exports = multer({storage: storage}).single('image');