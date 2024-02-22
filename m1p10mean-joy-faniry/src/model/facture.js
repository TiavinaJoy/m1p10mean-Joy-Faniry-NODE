const {mongoose } = require("../configuration/database");
const rendezVous = require("./rendezVous");
const utilisateur = require("./utilisateur");


const factureSchema = new mongoose.Schema({
  client: {
    type: utilisateur.schema,
    required: [true,"Le client est obligatoire."]
  },
  rendezVous: {
    type: rendezVous.schema,
    required: [true,"Le rendez-vous est obligatoire."]
  },
  prix:{
    type: Number,
    required:[true, "Le prix est obligatoire."]
  }
});

factureSchema.set('timestamps',true);

const facture = mongoose.model('facture', factureSchema,'facture');

module.exports =  facture;
