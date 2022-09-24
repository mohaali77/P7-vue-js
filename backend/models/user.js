const mongoose = require('mongoose');
//on importe unique validator pour éviter les bugs d'email unique
const uniqueValidator = require('mongoose-unique-validator');

//schéma de données pour nos utilisateurs 
const userSchema = mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isadmin: { type: Boolean, required: true, default: false }
});

//on applique le validateur au schéma avant d'en faire un modèle 
userSchema.plugin(uniqueValidator);

//on exporte le modèle 
module.exports = mongoose.model('User', userSchema);