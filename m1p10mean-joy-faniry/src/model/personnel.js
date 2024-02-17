const {mongoose } = require("../configuration/database");
const service = require("./service");
const role = require("./role");


const personnelSchema = new mongoose.Schema({
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
    dateEmbauche: {
        type: Date,
        default: new Date(),
        required: [true,"La date d'embauche est obligatoire."]
    },
    finContrat: {
        type: Date
    },
    // role: {
    //   type: rolePersonnel.schema,
    //   required: true
    // },
    salaire: {
        type: Number,
        required: [true,"Le salaire est obligatoire."]
    },
    service:{
      type: [service.schema],
      required: true
    } 
});

personnelSchema.set('timestamps',true);

const personnel = mongoose.model('personnel', personnelSchema,'personnel');

module.exports = personnel;
