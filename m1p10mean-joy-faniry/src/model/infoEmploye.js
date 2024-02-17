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
        type: Date
    },
    salaire: {
        type: Number,
        required: [true,"Le salaire est obligatoire."]
    },
    service:{
      type: [service.schema],
      required: true
    } 
});

infoEmployeSchema.set('timestamps',true);

const infoPersonnel = mongoose.model('infoEmploye', infoEmployeSchema,'infoEmploye');

module.exports = infoPersonnel;
