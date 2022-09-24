//on crée le routeur
const express = require('express');
const router = express.Router();
//on importe le controleur pour pouvoir associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

//on crée les 2 routes POST qui seront relié à nos controleurs qui serviront à s'inscrire et à se connecter
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user', userCtrl.user);

//on exporte le routeur pour pouvoir l'importer dans app.js
module.exports = router;