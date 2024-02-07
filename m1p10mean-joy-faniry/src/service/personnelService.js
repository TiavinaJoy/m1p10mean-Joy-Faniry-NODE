const personnel = require("../model/personnel");
const { validateEmail } = require("../helper/validation");
const { generateAccessToken  } = require("../model/token");
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

        const employe = await personnel.findOne({ mail: email });
        const manager = await personnel.findOne({ mail: email });

console.log("EMPLOYEEE **** ", employe);
        const compareMdpEmp = await bcrypt.compare(mdp,employe.mdp);
        const compareMdpManager = await bcrypt.compare(mdp,manager.mdp);
        
        if(employe && compareMdpEmp) {
            retour.status = 200;
            retour.message = "Connecté";
            retour.data = {
                token: generateAccessToken(data,'employe'),
                employe: employe
            }
        }
        else if(manager && compareMdpManager) {
            retour.status = 200;
            retour.message = "Connecté";
            retour.data = {
                token: generateAccessToken(data,'manager'),
                manager: manager
            }
        }
        else {
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
    connexion
};