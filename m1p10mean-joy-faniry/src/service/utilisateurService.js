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
        if(await verifyMailUnique(data.mail) === false)throw new Error('Mail déjà utilisé');
        if(data.mdp.localeCompare(data.confirmMdp)!=0) throw new Error("Les mots de passes ne correspondent pas.");
        const clientRole = await role.findOne({intitule: {$regex: 'Client'}});
        const newutilisateur = new utilisateur(data);
        newutilisateur.role = clientRole;
        const validation = newutilisateur.validateSync();
        if (validation  && validation.name === "ValidationError") {
            throw validation;
        }
        newutilisateur.mdp= await new Promise((resolve, reject) => {
            bcrypt.hash(data.mdp, 10, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
            });
        })
        // bcrypt.genSalt(10, async (err,salt) => {
        //     const hash = await bcrypt.hash(data.mdp, salt);
        //     newutilisateur.mdp = hash;
        // });
        newutilisateur.statut = 1;
        const retourUser = await newutilisateur.save();
        const token = generateAccessToken(retourUser, 'utilisateur');
        retourUser.mdp = "";
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
        const personne = await utilisateur.findOne({ mail: data.mail});
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
                    token: generateAccessToken(personne,personne.role.intitule),
                    user: personne,
                    type: personne.role.intitule
                }
            } else {
                retour.status = 400;
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

async function verifyMailUnique(email){
    try {
        const user = await utilisateur.exists({mail:email})
        return user == null;
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}

module.exports = {
    inscription,
    connexion,
    verifyMailUnique
};