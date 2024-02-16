const { connection,mongoose } = require("../configuration/database");
const uniqueValidator = require('mongoose-unique-validator');
const infoPersonnel = require("./infoPersonnel");
const role = require("./role");

connection();
const utilisateurSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: [true,"L'email est obligatoire."],
    unique: true,
    trim: [true,"L'email ne doit pas contenir d'espace."],
    lowercase: [true,"L'email ne doit pas contenir de caractère en majuscule"],
    validate: {
        validator: function(email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message:"Ce n'est pas un email valide."
    }
  },
  mdp: {
    type: String,
    required: [true,"Mot de passe obligatoire."],
    minLength:[8,"Le mot de passe doit contenir 8 lettres au minimum."],
    validate: 
    [
      {
        validator: function (mdp) {
            return /[A-Z]/.test(mdp)
          },
          message: 'Le mot de passe doit contenir un caractère majuscule.'
      },
      {
        validator: function (mdp) {
          return /[a-z]/.test(mdp)
        },
        message: 'Le mot de passe doit contenir des caractères minuscule.'
      },
      {
        validator: function (mdp) {
            return /[!@#$%^&*()_+/{}\[\]:;<>,.?\\-]/.test(mdp)
          },
          message: 'Le mot de passe doit contenir des caractères spéciaux.'
      },
      {
        validator: function (mdp) {
          return /\d/.test(mdp)
        },
        message: 'Le mot de passe doit contenir des chiffres.'
      }
    ]
  },
  nom: {
    type: String,
    required: [true,"Le nom est obligatoire."]
  },
  prenom: {
    type: String,
    required: [true,"Le prénom est obligatoire."]
  },
  dateInscription: {
    type: Date,
    default: new Date()
  },
  statut: {
    type:Boolean,
    default: 0
  },
  role: {
    type: role.schema
  },
  infoPersonnel: {
    type: infoPersonnel.schema
  }
});

utilisateurSchema.set('timestamps',true);
utilisateurSchema.plugin(uniqueValidator, {message: "Email {VALUE} déjà utilisé. "});

const utilisateur = mongoose.model('utilisateur', utilisateurSchema,'utilisateur');

module.exports = utilisateur;