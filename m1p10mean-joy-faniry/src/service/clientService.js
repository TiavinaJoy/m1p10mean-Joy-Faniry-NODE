const client = require("../model/client");
const { validateEmail } = require("../helper/validation");
const { generateAccessToken  } = require("../model/token");
const { mongoose } = require("../configuration/database");
const bcrypt = require("bcrypt");

/*Inscription client*/
async function inscription(data) {
    const retour = {};
    try{
        const newClient = new client(data);
        const validation = newClient.validateSync();
        if (validation  && validation.name === "ValidationError") {
            throw validation;
        }
        bcrypt.genSalt(10, async (err,salt) => {
            const hash = await bcrypt.hash(data.mdp, salt);
            newClient.mdp = hash;
        });
        newClient.statut = 1;
        await newClient.save();
        const token = generateAccessToken(data,'client');
        retour.status = 201;
        retour.message = "Client inscrit";
        retour.data = token;
        return retour;
    }catch(error){
       throw error;
    }finally{
        mongoose.connection.close
    }    
}

/*Connexion client */
async function connexion(data) {
    const retour = {}
    try{
        const mdp = data.mdp;
        const email = data.mail;

        if(!validateEmail(email)) {
            retour.status = 400;
            retour.message = "Email invalide.";
            retour.data = data;
            return retour;
        }

        const util = await client.findOne({ mail: email });
        const compareMdp = await bcrypt.compare(mdp,util.mdp);
        if(util && compareMdp) {
            retour.status = 200;
            retour.message = "Connecté";
            retour.data = {
                token: generateAccessToken(data,'client'),
                client: util
            }
        } else {
            retour.status = 401;
            retour.message = "Email ou mot de passe incorrect.";
            retour.data = data;
        }

        return retour;
    }catch(error) {
        throw error;
    }finally{
        mongoose.connection.close;
    }
}

module.exports = {
    inscription,
    connexion
};