const { mongoose } = require("../configuration/database");
const service = require("./service");
const rolePersonnel = require("./role");


const infoEmployeSchema = new mongoose.Schema({
    dateEmbauche: {
        type: Date,
        default: new Date(),
        required: [true,"La date d'embauche est obligatoire."]
    },
    finContrat: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.dateEmbauche;
            },
            message: "La date de fin de contrat doit être supérieure à la date d'embauche."
        }
    },
    salaire: {
        type: Number,
        default:1,
        required: [true,"Le salaire est obligatoire."],
        min: [1,"Le salaire doit être supérieur à 0"]
    },
    service:{
      type: [service.schema],
      required: true
    } 
});

infoEmployeSchema.set('timestamps',true);

const infoPersonnel = mongoose.model('infoEmploye', infoEmployeSchema,'infoEmploye');

module.exports = infoPersonnel;
