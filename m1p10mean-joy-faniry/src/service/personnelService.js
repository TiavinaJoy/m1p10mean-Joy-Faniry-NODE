require("dotenv").config();
const utilisateur = require("../model/utilisateur");
const service = require("../model/service");
const role = require("../model/role");
const infoEmploye = require("../model/infoEmploye");
const infoEmployervice = require("../model/infoEmploye");
const { generateAccessToken  } = require("./tokenService");
const { createInfoEmploye  } = require("./infoEmployeService");
const roleService = require("./roleService");
const { mongoose } = require("../configuration/database");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const {filtreValidation} = require('../helper/validation');

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
async function createPersonnel(data){
    const retour = {};
    const session =  await mongoose.startSession();
    session.startTransaction();
    const defaultMdp = process.env.DEFAULT_MDP;
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
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(defaultMdp, 10, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
            });
        })
        data.mdp = hashedPassword;
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

async function changeStatutPersonnel(params, query){
    try {
        const updatePersonnel = await utilisateur.updateOne({_id: new ObjectId(params.personnelId), $or:[
            { 'role.intitule': "Manager"} ,
            { 'role.intitule': "Employé" }
        ]}, {$set:{statut: query.statut}});
        // tokony ampiana filtre hoe : role = manager ou employé
        return {
            status : 200,
            message : "Utilisateur mis à jour.",
            data:{
                utilisateur:updatePersonnel
            }
        }
    } catch (error) {
        throw error;   
    }finally{
        mongoose.connection.close
    }
}

async function modificationPersonnel(params, data){
    const retour = data;
    try {
        if(data.mdp.localeCompare(data.confirmMdp)!==0){
            retour.status = 400,
            retour.message = "Les mots de passes ne correspondent pas.",
            retour.data = {};
            return retour
        }
        const filtre = {_id: new ObjectId (params.personnelId), $or:[
            { 'role.intitule': "Manager"} ,
            { 'role.intitule': "Employé" }
        ]};
        const employe = {
            nom: data.nom,
            prenom: data.prenom,
            mail:data.mail
        }
       
        const hashedPassword = await new Promise((resolve, reject) => {
            bcrypt.hash(data.mdp, 10, function(err, hash) {
            if (err) reject(err)
            resolve(hash)
            });
        })

        employe.mdp = hashedPassword;
        // bcrypt.genSalt(10,  (err,salt) => {
        //     const hash =  bcrypt.hash(data.mdp, salt);
        //     employe.mdp = hash;
        // });
        console.log(employe);
        const updatePersonnel = await utilisateur.updateOne(filtre,{$set:employe} );
        retour.status = 200;
        retour.message = "Utilisateur mis à jour.";
        retour.data = {
            utilisateur: employe
        };
        return retour
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    }
}

async function getDetailPersonnel(params){
    retour = {}
    try {
        const employe = await utilisateur.findOne(
            {
                _id: new ObjectId(params.personnelId), 
                $or:[
                    { 'role.intitule': "Manager"} ,
                    { 'role.intitule': "Employé" }
                ]
            }
        );
        if(employe === null){
            throw new Error('Employé introuvable');
        }
        employe.mdp = "";
        retour.status = 200;
        retour.message = "";
        retour.data = employe;
        return retour;
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    }
}
async function modificationInfoEmploye(params, body){
    const session =  await mongoose.startSession();
    session.startTransaction();
    retour = {};
    try {
        // tadiavina aloha le liste service attribuena aminy 
        var listeIdService = [];
        body.service.forEach(service => {
            listeIdService.push(new ObjectId(service))
        });
        const filtreService = {_id:{$in:listeIdService}};
        const services = await service.find(filtreService);
        const newInfoEmp= {
            salaire: body.salaire,
            finContrat: body.finContrat ?? '',
            service:services
        }
        // dia sao dia niova ny rôle any
        const idRole = body.role;
        const roleEmp = await roleService.findById(idRole);
        // ovao amzay aloha ary le infoEMp
        console.log(roleEmp);
        await infoEmploye.updateOne(
            { _id: new ObjectId(body.idInfoEmploye)},
            {$set: newInfoEmp}
        , {session});
        const updatedEMp = {role: roleEmp, infoEmploye: newInfoEmp};
        const newEMp = await utilisateur.updateOne({_id: params.personnelId},
            {$set: updatedEMp}, {session});
        session.commitTransaction();
        retour.status = 200;
        retour.message = "Utilisateur mis à jour";
        retour.data = newEMp;
        return retour;
    } catch (error) {
        console.log(error);
        session.abortTransaction();
        throw error
    }finally{
        mongoose.connection.close
    }
}


async function find(query){
    const retour = {}
    try {
       var filtre = {};
    //    nom , prenom, email, dateInscription? dateEmbauche, statut, role, fincontrat, service, salaire
    if(filtreValidation(query.nom)) filtre.nom = {$regex: query.nom , '$options' : 'i'}
    if(filtreValidation(query.prenom )) filtre.prenom = {$regex: query.prenom, '$options' : 'i'}
    if(filtreValidation(query.mail )) filtre.mail = {$regex: query.mail, '$options' : 'i'}
    if(filtreValidation(query.statut) ) filtre.statut = Boolean(query.statut)
    if(filtreValidation(query.role) ) filtre.role = {_id:new ObjectId(query.role)}
    if(filtreValidation(query.salaireMin) || filtreValidation(query.salaireMax)){
        if(filtreValidation(query.salaireMin) && filtreValidation(query.salaireMax)) filtre["infoEmploye.salaire"] ={
            $gte: query.salaireMin, 
            $lte: query.salaireMax
        }
        else if (filtreValidation(query.salaireMin) && !filtreValidation(query.salaireMax)) filtre["infoEmploye.salaire"] = {$gte: query.salaireMin}
        else if (!filtreValidation(query.salaireMin) && filtreValidation(query.salaireMax)) filtre["infoEmploye.salaire"] = {$lte: query.salaireMax}
    }
    if(filtreValidation(query.dateEmbaucheMin) || filtreValidation(query.dateEmbaucheMax)){
        if(filtreValidation(query.dateEmbaucheMin) && filtreValidation(query.dateEmbaucheMax)) filtre["infoEmploye.dateEmbauche"] ={
            $gte: query.dateEmbaucheMin, 
            $lte: query.dateEmbaucheMax
        }
        else if (filtreValidation(query.dateEmbaucheMin) && !filtreValidation(query.dateEmbaucheMax)) filtre["infoEmploye.dateEmbauche"] = {$gte: query.dateEmbaucheMin}
        else if (!filtreValidation(query.dateEmbaucheMin) && filtreValidation(query.dateEmbaucheMax)) filtre["infoEmploye.dateEmbauche"] = {$lte: query.dateEmbaucheMax}
    }
    if(filtreValidation(query.finContratMax) || filtreValidation(query.finContratMin)){
        if(filtreValidation(query.finContratMin) && filtreValidation(query.finContratMax)) filtre["infoEmploye.finContrat"] ={
            $gte: query.finContratMin, 
            $lte: query.finContratMax
        }
        else if (filtreValidation(query.finContratMin) && !filtreValidation(query.finContratMax)) filtre["infoEmploye.finContrat"] = {$gte: query.finContratMin}
        else if (!filtreValidation(query.finContratMin) && filtreValidation(query.finContratMax)) filtre["infoEmploye.finContrat"] = {$lte: query.finContratMax }
    }
    if(filtreValidation(query.service)) filtre["infoEmploye.service._id"] = query.service;

        const users = await utilisateur.paginate(
             filtre,
            { 
                // offset: query.perPage ?? 10  * query.page ?? 0, 
                limit: query.perPage ?? 10,
                page: query.page==0 ? 1 : query.page
            }
        ).then({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = users;
        return retour;
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}

async function getAllActivePersonnel(){
    retour = {}
    try {
        const personnels = await utilisateur.find({statut: true, $or: [{ 'role.intitule': "Employé" }]});
        retour = {
            status : 200,
            message : "",
            data: personnels
        }
        return retour
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}


async function findById(id){
    try {
        const emp = await utilisateur.find({_id: new ObjectId(id)});
        if(emp.length == 1) return emp[0];
        throw new Error('Employé introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}
module.exports = {
    connexion, createPersonnel, changeStatutPersonnel, modificationPersonnel, getDetailPersonnel, modificationInfoEmploye, find
    ,getAllActivePersonnel, findById
}