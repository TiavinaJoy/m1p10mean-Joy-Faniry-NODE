const { connection,mongoose } = require("../configuration/database");

connection();
const roleSchema = new mongoose.Schema({
  intitule: {
    type: String,
    required: [true,"Le nom du rôle de l'utilisateur est obligatoire."]
  }
});

roleSchema.set('timestamps',true);

const role = mongoose.model('role', roleSchema,'role');

module.exports =  role;
