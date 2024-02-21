const { mongoose } = require("../configuration/database");
const utilisateur = require("./utilisateur");

const horairePersonnelSchema = new mongoose.Schema({
    dateDebut: {
        type: Date,
        default: new Date(),
        required: [true,"La date de début est obligatoire."],
        validator: function (value) {
            return new Date(value) > new Date()
        },
        message: "La date fin  doit être supérieure à la date de début."
    },
    dateFin: {
        type: Date,
        required: [true,"La date de fin est obligatoire."],
        validator: function (value) {
            return value > this.dateDebut;
        },
        message: "La date fin  doit être supérieure à la date de début."
    },
    personnel: {
        type: utilisateur.schema,
        required: [true,"Le personnel est obligatoire."]
    },
    statut:{
      type: Boolean,
      default: 1
    } 
});

horairePersonnelSchema.set('timestamps',true);

const horairePersonnel = mongoose.model('horairePersonnel', horairePersonnelSchema,'horairePersonnel');

module.exports = horairePersonnel;
