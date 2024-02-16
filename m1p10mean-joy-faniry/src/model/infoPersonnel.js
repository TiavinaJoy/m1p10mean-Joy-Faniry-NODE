const { connection,mongoose } = require("../configuration/database");
const service = require("./service");
const rolePersonnel = require("./role");

connection();
const infoPersonnelSchema = new mongoose.Schema({
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

infoPersonnelSchema.set('timestamps',true);

const infoPersonnel = mongoose.model('infoPersonnel', infoPersonnelSchema,'infoPersonnel');

module.exports = infoPersonnel;
