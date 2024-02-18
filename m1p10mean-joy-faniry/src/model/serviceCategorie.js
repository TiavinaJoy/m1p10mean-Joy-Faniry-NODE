const { mongoose } = require("../configuration/database");

const serviceCategorieSchema = new mongoose.Schema({
  intitule: {
    type: String,
    required: [true,"Le nom de la catégorie de service est obligatoire."]
  }
});

serviceCategorieSchema.set('timestamps',true);

const serviceCategorie = mongoose.model('serviceCategorie', serviceCategorieSchema,'serviceCategorie');

module.exports = serviceCategorie;
