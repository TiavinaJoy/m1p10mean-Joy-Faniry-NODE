const { mongoose } = require("../configuration/database");
const utilisateur = require("./utilisateur");
const mongoosePaginate = require("mongoose-paginate-v2");
const { timezoneDateTime } = require("../helper/DateHelper");

const horairePersonnelSchema = new mongoose.Schema({
    dateDebut: {
        type: Date,
        default: new Date(),
        required: [true,"La date de début est obligatoire."],
        validate: {
            validator: function (value) {
                const today = new Date();
                today.setHours(today.getHours() + 3);
                const daty = timezoneDateTime(value);
                return daty > today

            },
            message: "La date de début doit être supérieure à la date du jour."
        }
        
    },
    dateFin: {
        type: Date,
        required: [true,"La date de fin est obligatoire."],
        validate: {
            validator: function (value) {
                return value > this.dateDebut;
            },
            message: "La date fin  doit être supérieure à la date de début."
        }
        
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
horairePersonnelSchema.plugin(mongoosePaginate);

const horairePersonnel = mongoose.model('horairePersonnel', horairePersonnelSchema,'horairePersonnel');

module.exports = horairePersonnel;
