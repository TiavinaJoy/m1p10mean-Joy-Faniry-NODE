require("dotenv").config();
const mongoose = require("mongoose");
const dbURI = process.env.DATABASE_URL;

mongoose.connect(dbURI,{
    useNewUrlParser : true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log('Connecté à la base de données MongoDB');
  });
  
mongoose.connection.on('error', (err) => {
console.error('Erreur de connexion à la base de données :', err);
});

mongoose.connection.on('disconnected', () => {
console.log('Déconnexion de la base de données');
});

module.exports = mongoose.connection;