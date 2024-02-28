const {mongoose } = require("../configuration/database");
const serviceCategorie = require("./serviceCategorie");
const mongoosePaginate = require("mongoose-paginate-v2");


const serviceSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true,"Le nom du service est obligatoire."]
    },
    prix: {
        type: Number,
        required: [true,"Le prix est obligatoire."],
        min: [1,"Le prix doit être supérieur à 0"]
    },
    commission: {
        type: Number,
        required: [true,"La commission est obligatoire."],
        min: [0,"La commission doit être supérieur ou égale à 0"]
    },
    duree: {
        type: Number,
        required: [true,"La durée est obligatoire."],
        min: [1,"La durée doit être supérieur à 0"]
    },
    statut: {
        type: Boolean,
        default:1
    },
    description: {
        type: String,
        required: [true,"La description est obligatoire."]
    },
    categorie: {
        type: serviceCategorie.schema,
        required: true
    },
    isSpecial:{
        type: Boolean,
        default:0
    },
    oldPrice:{
        type: Number,
    },
    debutOffre:{
        type: Date,
    },
    finOffre:{
        type: Date,
    }
});

serviceSchema.set('timestamps',true);
serviceSchema.plugin(mongoosePaginate);

const service = mongoose.model('service', serviceSchema,'service');

module.exports =  service;
