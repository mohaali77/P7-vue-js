const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log(req.body);
        //on extrait le token du header
        const token = req.headers.authorization.split(' ')[1];
        //on decode notre token, s'il n'est pas valide il renverra une erreur
        const decodedToken = jwt.verify(token, process.env.jwt_secret);
        //on récupère le userID dans le token
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};