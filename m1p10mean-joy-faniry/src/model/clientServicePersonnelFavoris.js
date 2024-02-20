const { mongoose } = require("../configuration/database");
const service = require("./service");
const utilisateur = require("./utilisateur");


const clientServicePersonnelFavorisSchema = new mongoose.Schema({
    client: {
        type: utilisateur.schema,
        required: [true,"Le client est obligatoire."],
        index:false
    },
    personnel: {
        type: [utilisateur.schema],
        index:false
    },
    service:{
      type: service.schema,
      required: true
    },
    statut:{
        type: Boolean,
        default: 1
    } 
});

clientServicePersonnelFavorisSchema.set('timestamps',true);

const clientServicePersonnelFavoris = mongoose.model('clientServicePersonnelFavoris', clientServicePersonnelFavorisSchema,'clientServicePersonnelFavoris');

module.exports = clientServicePersonnelFavoris;
