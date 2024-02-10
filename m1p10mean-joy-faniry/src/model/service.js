const { connection,mongoose } = require("../configuration/database");
const serviceCategorie = require("./serviceCategorie");

connection();
const serviceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true,"Le nom du service est obligatoire."]
    },
    prix: {
        type: Number,
        required: [true,"Le prix est obligatoire."]
    },
    commission: {
        type: Number,
        required: [true,"La commission est obligatoire."]
    },
    duree: {
        type: Number,
        required: [true,"La durée est obligatoire."]
    },
    statut: {
        type: String,
        required: [true,"Le statut est obligatoire."]
    },
    description: {
        type: String,
        required: [true,"La description est obligatoire."]
    },
    categorie: {
        type: serviceCategorie.schema,
        required: true
    }
});

serviceSchema.set('timestamps',true);

const service = mongoose.model('service', serviceSchema,'service');

module.exports =  service;
