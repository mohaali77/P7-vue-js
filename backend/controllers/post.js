//on importe le modèle de la post
const Post = require('../models/post');
const User = require('../models/user')
const fs = require('fs');

//Création d'une nouvelle post
exports.createPost = (req, res, next) => {
  console.log('createpost');
  console.log(req.body);
  const postObject = JSON.parse(req.body.post)
  //on supprime ces deux champs envoyé par la requête car nous ne devons pas faire confiance au client
  delete postObject._id;
  delete postObject._userId;
  const post = new Post({
    ...postObject,
    //ici on récupère le userId extrait du token par le middleware d’authentification.
    userId: req.auth.userId,
    //on génère l'URL de l'image
    likes: 0,
    usersLiked: [],

  });
  if (req.file) {
    post.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }
  //on enregistre l'objet dans la base de données
  post.save()
    .then(() => res.status(201).json({ message: "Nouveau post ajouté avec succès !" }))
    .catch(error => res.status(400).json({ error }));
};

//Affiche la post lorsque l'on clique sur elle
exports.getOnePost = (req, res, next) => {
  Post.findOne({
    _id: req.params.id
  }).then(
    (post) => {
      res.status(200).json(post);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Modifier une post déjà existante
exports.modifyPost = (req, res, next) => {
  //on vérifie s'il y a un champs file
  const postObject = JSON.parse(req.body.post)
  if (req.file) {
    postObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }

  //on supprime le userID de la requête pour empêché l'utilisateur de réassigner l'objet à un autre utilisateur
  delete postObject._userId;
  //on récupère notre objet dans la BD
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      User.findOne({ _id: req.auth.userId })
        .then(user => {
          //si l'userID de la base de données est différent de celui du TOKEN on renvoie une erreur
          if (post.userId != req.auth.userId && !user.isadmin) {
            res.status(401).json({ message: 'Non-autorisé' });
          }
          else {
            if (req.file && post.imageUrl) {
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
              });
            }
            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet modifié!' }))
              .catch(error => res.status(401).json({ error }));
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({ error })
        });
    })
    .catch((error) => {
      res.status(400).json({ error });
      console.log(error);
    });
};

//suppression d'une post existante
exports.deletePost = (req, res, next) => {
  //on récupère notre objet dans la BD
  Post.findOne({ _id: req.params.id })
    .then(post => {
      if (post.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        if (post.imageUrl) {
          const filename = post.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Post.deleteOne({ _id: req.params.id })
              .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
              .catch(error => res.status(500).json({ error }));
          });
        } else {
          Post.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(500).json({ error }));
        }
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

//Affichage de toute les posts sur la page d'accueil
exports.getAllPosts = (req, res, next) => {
  Post.find().then(
    (posts) => {
      //
      posts.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
      });
      res.status(200).json(posts);
    }
  ).catch(
    (error) => {
      res.status(500).json({
        error: error
      });
    }
  );
};

//Gestion des likes
exports.postLikeDislike = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {

      let likeIndex = post.usersLiked.findIndex((userId => userId == req.body.userId));

      // Si l'utilisateur clique sur le like, on pousse son userID dans le tableau des likes, et on ajoute +1 au like
      if (req.body.like === 1 && !post.usersLiked.includes(req.body.userId)) {
        post.usersLiked.push(req.body.userId);
        post.likes++;
        Post.updateOne({ _id: req.params.id }, post).then(() => {
          res.status(200).json({ message: "Like enregistré !", like: true });
        });
      } else {
        if (likeIndex !== -1) {
          post.usersLiked.splice(likeIndex, 1)
          post.likes--;
          Post.updateOne({ _id: req.params.id }, post).then(() => {
            res.status(200).json({ message: "Like enlevé !", like: false });
          });
        }
      }
      //Si l'utilisateur enlève son like, le likeIndex va aller chercher l'userID dans le tableau des likes 
      //et va le supprimer, on enlève ensuite 1 au tableau des likes. Pareil pour les dislikes.

      //on met à jour la gestion des likes de la post


      //console.log(req.body.like)
      console.log("tableau des likes :")
      console.log(post.usersLiked);


    }
    ).catch(
      (error) => {
        console.log(error);
        res.status(500).json({
          error: error
        });
      }
    );
};

//revoir isadmin