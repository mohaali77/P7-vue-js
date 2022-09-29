//on importe les différents outils que l'on va utiliser avec une constante grâce a "require"
const express = require('express');
//permet de se connecter à la base de données, créer des modèles...
const mongoose = require('mongoose');
const path = require('path');
//helmet ajoute des en-tête pour les appels qui vont être fait depuis notre site
const helmet = require("helmet");
//mongoSanitize traite les inputs avant d'être envoyé en base de données afin d'éviter des données malicieuses
const mongoSanitize = require('express-mongo-sanitize');
//permet de limiter un nombre excessif de requête par un utilisateur/détecte les comportements anormaux et les bloquent
const rateLimit = require('express-rate-limit')
//permet de définir des variables d'environnements
const dotenv = require('dotenv').config()
//permet de définir une politique de mot de passe
const passwordValidator = require('password-validator');
const cors = require('cors')

//les différentes routes sont importées
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

//on créer une application express
const app = express();

//cors bloque est une sécurité qui empêches les utilisateurs d'accéder à l'API, il faut donc un middleware pour accorder l'accès
//ce middleware qui permet à tout le monde d'accéder à notre API, d'utiliser certaines en-tête, et d'utiliser les requête POST, PUT etc.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //permet de passer au middleware suivant
  next();
});

const schema = new passwordValidator();

//Le schéma du mot de passe souhaité
schema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits(2)                                // Must have at least 2 digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']);

//permet à tout le code d'avoir accès au schéma
app.locals.passwordSchema = schema;

//limiteur
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000, // 
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(limiter)

app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" }, }));

app.use(mongoSanitize());

app.use(express.json());

app.use(cors())

//ici on enregistre les routes qui ont été importés 
app.use('/api/posts', postRoutes);
app.use('/api/auth', userRoutes);
//on ajoute la route pour enregistrer nos images
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect('mongodb+srv://' + process.env.db_user + ':' + process.env.db_password + '@' + process.env.db_url + '/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//on exporte notre application pour y avoir accès depuis nos autres fichiers  
module.exports = app;

