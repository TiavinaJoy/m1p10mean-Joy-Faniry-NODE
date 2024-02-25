const {mongoose } = require("../configuration/database");
const facture = require("./facture");
const utilisateur = require("./utilisateur");
const mongoosePaginate = require("mongoose-paginate-v2");


const paiementSchema = new mongoose.Schema({
  facture: {
    type: facture.schema,
    required: [true,"Un paiement doit correspondre à au moins une facture."]
  },
  payeur: {
    type: utilisateur.schema,
    required: [true, "Payeur (débiteur) requis."]
  }
});

paiementSchema.set('timestamps',true);
paiementSchema.plugin(mongoosePaginate);

const paiement = mongoose.model('paiement', paiementSchema,'paiement');
module.exports =  paiement;
