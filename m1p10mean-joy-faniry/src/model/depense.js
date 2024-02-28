const {mongoose } = require("../configuration/database");

 
const depenseSchema = new mongoose.Schema({
  intitule: {
    type: String,
    required: [true,"L'intitule de la dépense est obligatoire."]
  },
  type:{
    type: String,
    enum:['Achat pièce','Autre dépense','Loyer']
  },
  montant:{
    type: Number,
    min:[1,'Une dépense doit être supérieur à 0']
  },
  datePaiement:{
    type: Date,
    default: new Date(Date.now() + 3 * 60 * 60 * 1000)
  }
});

depenseSchema.set('timestamps',true);

const depense = mongoose.model('depense', depenseSchema,'depense');

module.exports =  depense;
