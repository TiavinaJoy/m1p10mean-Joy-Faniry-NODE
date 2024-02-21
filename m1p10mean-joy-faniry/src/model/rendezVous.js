const { mongoose } = require("../configuration/database");
const service = require("./service");
const statutRendezVous = require("./statutRendezVous");
const utilisateur = require("./utilisateur");


const rendezVousSchema = new mongoose.Schema({
    client:{
        type: utilisateur.schema,
        required: [true, "le client est obligatoire"]
    },
    dateRendezVous:{
        type: Date,
        default: new Date()
    },
    personnel:{
        type: utilisateur.schema,
        required: [true, "le personnel est obligatoire"]
    },
    statut:{
        type: statutRendezVous.schema,
        default:{
            "_id":{"$oid":"65d515a1dd12de809a87a47a"}
            ,"intitule":"Nouveau"}
    },
    service:{
        type:service.schema,
        required:[true, "Un service est requis "]
    }
});

rendezVousSchema.set('timestamps', true);

const rendezVous = mongoose.model('rendezVous', rendezVousSchema, 'rendezVous');

module.exports = rendezVous;
