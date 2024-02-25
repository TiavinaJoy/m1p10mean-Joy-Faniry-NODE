const { mongoose } = require("../configuration/database");
const service = require("./service");
const statutRendezVous = require("./statutRendezVous");
const utilisateur = require("./utilisateur");
const { ObjectId } = require("mongodb");
const mongoosePaginate = require("mongoose-paginate-v2");


const rendezVousSchema = new mongoose.Schema({
    client:{
        type: utilisateur.schema,
        required: [true, "le client est obligatoire"]
    },
    dateRendezVous:{
        type: Date,
        default: new Date(),
        // validate: {
        //     validator: function (value) {
        //         const today = new Date();
        //         today.setHours(today.getHours() + 3);
        //         const daty = timezoneDateTime(value);
        //         return daty > today

        //     },
        //     message: "La date de début doit être supérieure à la date du jour."
        // }
    },
    dateFin:{
        type:Date,
        required:[true, "La date de fin est obligatoire"],
        validate: {
            validator: function (value) {
                return value > this.dateRendezVous;
            },
            message: "La date fin  doit être supérieure à la date de début."
        }
    },
    personnel:{
        type: utilisateur.schema,
        required: [true, "le personnel est obligatoire"]
    },
    statut:{
        type: statutRendezVous.schema,
        default:{
            "_id":{_id: new ObjectId("65d515a1dd12de809a87a47a")}
            ,"intitule":"Nouveau"}
    },
    service:{
        type:service.schema,
        required:[true, "Un service est requis "]
    },
    prixService:{
        type:Number,
        required:[true, "Le prix à payer est obligatoire"],
        min: [1,"Le prix doit être supérieur à 0"]
    }
});

rendezVousSchema.set('timestamps', true);
rendezVousSchema.plugin(mongoosePaginate);
const rendezVous = mongoose.model('rendezVous', rendezVousSchema, 'rendezVous');

module.exports = rendezVous;
