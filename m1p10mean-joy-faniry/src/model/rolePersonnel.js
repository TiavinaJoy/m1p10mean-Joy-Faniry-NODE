const { connection,mongoose } = require("../configuration/database");

connection();
const rolePersonnelSchema = new mongoose.Schema({
  intitule: {
    type: String,
    required: [true,"Le nom du rôle du personnel est obligatoire."]
  }
});

rolePersonnelSchema.set('timestamps',true);

const rolePersonnel = mongoose.model('rolePersonnel', rolePersonnelSchema,'rolePersonnel');

module.exports = rolePersonnel;
