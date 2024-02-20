const utilisateur = require("../model/utilisateur");
const { validateEmail,isEmpty } = require("../helper/validation");
const { generateAccessToken  } = require("./tokenService");
const { mongoose } = require("../configuration/database");
const bcrypt = require("bcrypt");
const role = require("../model/role");

/*Inscription utilisateur*/
async function inscription(data) {
    const retour = {};
    try{
        if(data.mdp.localeCompare(data.confirmMdp)!=0) throw new Error("Les mots de passes ne correspondent pas.");
        const clientRole = await role.findOne({intitule: {$regex: 'Client'}});
        const newutilisateur = new utilisateur(data);
        newutilisateur.role = clientRole;
        const validation = newutilisateur.validateSync();
        if (validation  && validation.name === "ValidationError") {
            throw validation;
        }
        bcrypt.genSalt(10, async (err,salt) => {
            const hash = await bcrypt.hash(data.mdp, salt);
            newutilisateur.mdp = hash;
        });
        newutilisateur.statut = 1;
        const retourUser = await newutilisateur.save();
        const token = generateAccessToken(data,'utilisateur');
        retour.status = 201;
        retour.message = "utilisateur inscrit";
        retour.data = {
            token: token,
            user: retourUser
        };
        return retour;
    }catch(error){
       throw error;
    }finally{
        mongoose.connection.close
    }    
}

/*Connexion utilisateur */
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

        const util = await utilisateur.findOne({ mail: email });

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
                    token: generateAccessToken(data,'utilisateur'),
                    user: util,
                    type: 'utilisateur'
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