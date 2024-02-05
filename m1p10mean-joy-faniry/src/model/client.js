const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
/*Déclaration du schéma du client avec validation*/

var message = "";
const clientSchema = new mongoose.Schema({
  mail: {
    type: String,
    required: [true,"L'email est obligatoire."],
    unique: true,
    trim: [true,"L'email ne doit pas contenir d'espace."],
    lowercase: [true,"L'email ne doit pas contenir de caractère en majuscule"],
    validate: {
        validator: function(email) {
           if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            message = "Ce n'est pas un email valide.";
           }
        },
        message: message 
    }
  },
  mdp: {
    type: String,
    required: [true,"Mot de passe obligatoire."],
    minLength:[8,"Le mot de passe doit contenir 8 lettres au minimum."],
    validate: {
        validator: function(mdp) {
            if(!/[A-Z]/.test(mdp)){
              message = "Le mot de passe doit contenir un caractère majuscule.";
            }
            else if(!/[a-z]/.test(mdp)){
              message = 'Le mot de passe doit contenir des caractères minuscule.';
            }  
            else if(!/[!@#$%^&*()_+/{}\[\]:;<>,.?\\-]/.test(mdp)){
              message = 'Le mot de passe doit contenir des caractères spéciaux';
            }  
            else if(!/\d/.test(mdp)){
              message = 'Le mot de passe doit contenir des chiffres.';
            } 
        },
        message: message 
    }
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
  },
});

clientSchema.set('timestamps',true);
clientSchema.plugin(uniqueValidator);

const client = mongoose.model('client', clientSchema,'client');
//client.validateSync();

module.exports = client;
