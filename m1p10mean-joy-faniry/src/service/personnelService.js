const personnel = require("../model/personnel");
const { validateEmail,isEmpty } = require("../helper/validation");
const { generateAccessToken  } = require("./tokenService");
const { mongoose } = require("../configuration/database");
const bcrypt = require("bcrypt");


/*Connexion personnel */
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

        const employe = await personnel.findOne({ mail: email });


        if(employe === null ) {

            retour.status = 400;
            retour.message = "Utilisateur inexistant.";
            retour.data = data;

        }else if(employe) {
            const compareMdpEmp = await bcrypt.compare(mdp,employe.mdp);
            if(!compareMdpEmp) {
                retour.status = 200;
                retour.message = "Connecté";
                retour.data = {
                    token: generateAccessToken(data,employe.role.intitule.toLowerCase()),
                    user: employe,
                    type: employe.role.intitule.toLowerCase()
                }
            } else {

                retour.status = 401;
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
    connexion
};