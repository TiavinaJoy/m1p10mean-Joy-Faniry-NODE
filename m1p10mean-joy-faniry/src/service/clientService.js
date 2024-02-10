const client = require("../model/client");
const { validateEmail,isEmpty } = require("../helper/validation");
const { generateAccessToken  } = require("./tokenService");
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
        retour.data = {
            token: token,
            user: newClient
        };
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
        if(isEmpty(mdp)) {
            retour.status = 400;
            retour.message = "Mot de passe obligatoire.";
            retour.data = data;
            return retour;
        }

        const util = await client.findOne({ mail: email });

        if(util === null) {
            retour.status = 400;
            retour.message = "Utilisateur inexistant.";
            retour.data = data;
        }else if (util){
            const compareMdp = await bcrypt.compare(mdp,util.mdp);
            
            if(compareMdp) {
                retour.status = 200;
                retour.message = "Connecté";
                retour.data = {
                    token: generateAccessToken(data,'client'),
                    user: util,
                    type: 'client'
                }
            }else {
                retour.status = 400;
                retour.message = "Email ou mot de passe incorrect.";
                retour.data = data;
            }
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