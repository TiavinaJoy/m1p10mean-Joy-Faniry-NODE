const { mongoose } = require("../configuration/database");

const rolePersonnelSchema = new mongoose.Schema({
  intitule: {
    type: String,
    required: [true,"Le nom du rôle du personnel est obligatoire."]
  }
});

rolePersonnelSchema.set('timestamps',true);

const rolePersonnel = mongoose.model('rolePersonnel', rolePersonnelSchema,'rolePersonnel');

module.exports =  rolePersonnel;
