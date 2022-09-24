//on crée le routeur 
const express = require('express');
const router = express.Router();

//on importe le controleur post
const postCtrl = require('../controllers/post');
//on importe le middleware qui vérifiera les infos d'authentification de l'utilisateur
const auth = require('../middleware/auth');
//on importe multer qui permet de facilité la gestion des fichiers entrant dans les requêtes http
const multer = require('../middleware/multer-config');

router.get('/', auth, postCtrl.getAllPosts);
router.post('/', auth, multer, postCtrl.createPost);

router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post("/:id/like", auth, postCtrl.postLikeDislike);

//auth placé avant les gestionnaire de routes pour qu'il soit executé avant
//multer est placé sur les routes post avant les gestionnonnaires de routes, mais après auth

//on exporte le routeur pour pouvoir l'importer dans app.js
module.exports = router;