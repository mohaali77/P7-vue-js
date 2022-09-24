//on importe notre modèle User puisque l'on va enregistrer et lire des utilisateurs dans ces middlewares
const User = require('../models/user')
//bcrypt nous servira à crypter le mot de passe de l'utilisateur pour le sécuriser
const bcrypt = require('bcrypt')
//jsonwebtoken va nous permettre de créer des token et les vérifiés
const jwt = require('jsonwebtoken');

//middleware qui servira pour s'inscrire
exports.signup = (req, res, next) => {
    if (!req.app.locals.passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: "Le mot de passe n'est pas valide !" })
        return
    }
    //on hash/crypte le mot de passe
    bcrypt.hash(req.body.password, 10)
        //on récupère le hash qu'on va enregistrer dans un nouvel utilisateur qui sera enregistré dans la base de données
        .then(hash => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            });
            //on enregistre notre utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//middleware qui servira pour se connecter
exports.login = (req, res, next) => {
    //on recherche l'utilisateur avec l'email qui nous a été transmit 
    User.findOne({ email: req.body.email })
        .then(user => {
            //si l'utilisateur n'est pas trouvé on renvoie une erreur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //on compare le mot de passe qui nous a été transmit avec le mot de passe dans la base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //si valid retourne false le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    //si le mot de passe est ok, on génère un token à partir de l'user id et de la clé secrète qui 
                    //qui sera utilisé dans le front pour s'authenfier pour pouvoir agir sur les posts
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.jwt_secret,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.user = (req, res, next) => {
    let token = req.headers.token; //token
    jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorized'
        })
        User.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) return console.log(err)
            return res.status(200).json({

                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user._id


            })
        })
    })
}

