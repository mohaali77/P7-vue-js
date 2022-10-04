//on importe le modèle de la post
const Post = require('../models/post');
const User = require('../models/user')
const fs = require('fs');

//Création d'une nouvelle post
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post)
  //on supprime ces deux champs envoyé par la requête car nous ne devons pas faire confiance au client
  delete postObject._id;
  delete postObject._userId;
  const post = new Post({
    ...postObject,
    //ici on récupère le userId extrait du token par le middleware d’authentification.
    userId: req.auth.userId,
    likes: 0,
    usersLiked: [],

  });
  //Si le post comporte une image, on génère l'URL de l'image
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
  const postObject = JSON.parse(req.body.post)
  //on vérifie s'il y a un champs file si c'est le cas on génère l'url de l'image
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
            //si une image est sélectionné, et qu'il y a dejà une image dans le post, on supprime l'image du post
            if (req.file && post.imageUrl) {
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
              });
            }
            // si lutilisateur est ladmin on garde le userid, le nom et le prénom d'avant la modification
            if (user.isadmin) {
              postObject.userId = post.userId
              postObject.firstName = post.firstName
              postObject.lastName = post.lastName
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
      User.findOne({ _id: req.auth.userId })
        .then(user => {
          //si l'userID de la base de données est différent de celui du TOKEN on renvoie une erreur et qu'il n'est pas l'admin
          if (post.userId != req.auth.userId && !user.isadmin) {
            res.status(401).json({ message: 'Not authorized' });
          } else {
            //si il y a une image dans le post, on la supprime avant de supprimer le post. 
            if (post.imageUrl) {
              const filename = post.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                  .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                  .catch(error => res.status(500).json({ error }));
              });
              //sinon on supprime tout simplement le post
            } else {
              Post.deleteOne({ _id: req.params.id })
                .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                .catch(error => res.status(500).json({ error }));
            }
          }
        }).catch(error => {
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

//suppression d'une image du post
exports.deleteImagePost = (req, res, next) => {
  //on récupère notre objet dans la BD
  Post.findOne({ _id: req.params.id })
    .then(post => {
      User.findOne({ _id: req.auth.userId })
        .then(user => {
          //si l'userID de la base de données est différent de celui du TOKEN on renvoie une erreur et qu'il n'est pas l'admin
          if (post.userId != req.auth.userId && !user.isadmin) {
            res.status(401).json({ message: 'Not authorized' });
          } else {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              post.imageUrl = null
              post.save()
                .then(() => res.status(201).json({ message: "Nouveau post ajouté avec succès !" }))
                .catch(error => res.status(400).json({ error }));
            })
          }
        }).catch(error => {
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

//Affichage de toute les posts sur la page d'accueil
exports.getAllPosts = (req, res, next) => {
  Post.find().then(
    (posts) => {
      posts.sort(function (a, b) {
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
exports.postLike = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {

      let likeIndex = post.usersLiked.findIndex((userId => userId == req.body.userId));

      //Si l'utilisateur clique sur le like et qu'il n'est pas présent dans le tableau des utilisateurs
      //qui ont likés, on pousse son userID dans le tableau des likes, on ajoute +1 au like, et on sauvegarde
      if (req.body.like === 1 && !post.usersLiked.includes(req.body.userId)) {
        post.usersLiked.push(req.body.userId);
        post.likes++;
        Post.updateOne({ _id: req.params.id }, post).then(() => {
          res.status(200).json({ message: "Like enregistré !", like: true });
        });
        //Sinon si l'utilisateur a déjà liké, on le supprime du tableau des likes, on ajoute -1 au like, et on sauvegarde
      } else {
        if (likeIndex !== -1) {
          post.usersLiked.splice(likeIndex, 1)
          post.likes--;
          Post.updateOne({ _id: req.params.id }, post).then(() => {
            res.status(200).json({ message: "Like retiré !", like: false });
          });
        }
      }

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