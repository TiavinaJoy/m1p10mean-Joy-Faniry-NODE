const personnel = require("../model/personnel");
const utilisateur = require("../model/utilisateur");
const { generateAccessToken  } = require("./tokenService");
const { createInfoEmploye  } = require("./infoEmployeService");
const roleService = require("./roleService");
const { mongoose } = require("../configuration/database");
const bcrypt = require("bcrypt");


/*Connexion personnel */
async function loginPersonnel(data) {
    const retour = {}
    try{
        const personne = await personnel.findOne({ mail: data.mail});
        if(personne === null) {
            retour.status = 400;
            retour.message = "Email ou mot de passe incorrect";
            retour.data = data;
        }else {
            const compareMdpEmp= await bcrypt.compare(data.mdp,personne.mdp);
            if(compareMdpEmp){
                personne.mdp ="";
                personne.type = personne.role.intitule;
                retour.status = 200;
                retour.message = "Connecté";
                retour.data = {
                    token: generateAccessToken(data,personne.role.intitule),
                    user: personne,
                    type: personne.role.intitule
                }
            } else {
                retour.status = 401;
                retour.message = "Email ou mot de passe incorrect.";
                retour.data = {};  
             }
        }
        return retour;
    }catch(error) {
        throw error;
    }finally{
        mongoose.connection.close;
    }
}

async function connexion(data) {
    const retour = {}
    try{
        const mdp = data.mdp;
        const email = data.mail;

        if(validateEmail(email)) {
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
        const manager = await personnel.findOne({ mail: email });


        if(employe === null || manager === null) {

            retour.status = 400;
            retour.message = "Utilisateur inexistant.";
            retour.data = data;

        }else if(employe || manager) {

            const compareMdpEmp = await bcrypt.compare(mdp,employe.mdp);
            const compareMdpManager = await bcrypt.compare(mdp,manager.mdp);
            employe.type = 'employe';
            manager.type = 'manager';
            if(compareMdpEmp) {
                retour.status = 200;
                retour.message = "Connecté";
                retour.data = {
                    token: generateAccessToken(data,'employe'),
                    user: employe,
                    type: 'employe'
                }
            }else if(compareMdpManager) {
                retour.status = 200;
                retour.message = "Connecté";
                retour.data = {
                    token: generateAccessToken(data,'manager'),
                    user: manager,
                    type: 'manager'
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
async function createPersonnel(data){
    const retour = {};
    const session =  await mongoose.startSession();
    session.startTransaction();
    try{
        const newInfoEmploye = {
            salaire: data.salaire,
            dateEmbauche: data.dateEmbauche,
            finContrat: data.finContrat ?? "",
            service : data.service
        }
        const addNewInfoEmploye = await createInfoEmploye(newInfoEmploye, {session});
        const role = await roleService.findById(data.role);
        data.infoEmploye = addNewInfoEmploye.data.infoEmploye;
        data.role = role;
        data.statut = 1;
        const newUser = new utilisateur(data);
        await newUser.save({session});
        // d aveo creena le utilisateur
        retour.status = 201;
        retour.message = "Utilisateur ajouté.";
        retour.data = {
            service: newUser
        };
        await session.commitTransaction();
        session.endSession()
        return retour;
    }catch(error){
        await session.abortTransaction();
    session.endSession();
       throw error; 
    }finally{
        mongoose.connection.close
    }    
}

module.exports = {
    connexion, loginPersonnel, createPersonnel
};