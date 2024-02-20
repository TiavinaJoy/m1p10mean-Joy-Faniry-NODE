const {mongoose } = require("../configuration/database");


const statutRendezVousSchema = new mongoose.Schema({
  intitule: {
    type: String,
    required: [true,"L'intitule est obligatoire."]
  }
});

statutRendezVousSchema.set('timestamps',true);

const statutRendezVous = mongoose.model('statutRendezVous', statutRendezVousSchema,'statutRendezVous');

module.exports =  statutRendezVous;
