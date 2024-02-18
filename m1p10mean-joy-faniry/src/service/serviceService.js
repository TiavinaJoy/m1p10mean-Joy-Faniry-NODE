const service = require("../model/service");
const serviceCategorie = require("../model/serviceCategorie");
const { mongoose } = require("../configuration/database");
const {findById} = require("./serviceCategorieService");
const { ObjectId } = require("mongodb");

async function listeService(query) {
    const retour = {};
    try{
        var categ = '';
        var stat = false;
        console.log(query);
        
        if(query.statut == 1) {
            stat = true;
        }
        else if(query.statut == 0) {
            stat = false;
        } 
        else {
            stat = ''
        }

        if(query.categorie != '')  categ = new ObjectId(query.categorie)
        console.log(' ffffffffffff ',categ);
        var queries = {
            $or: [
                {
                    prix:{ $gte: query.prixMin, $lte: query.prixMax }
                },
                {
                    commission:{ $gte: query.comMin , $lte: query.comMax  }
                },
                {
                    duree:{ $gte: query.dureeMin , $lte: query.dureeMax  }
                },
                {
                    statut: stat
                },
                {
                    nom:  { $regex: query.nom } 
                },
                {
                    description:  { $regex: query.description } 
                },
                {
                    'categorie._id': categ
                }
            ]
        }
        const services = await service.paginate(
            queries,
            { 
                offset: query.perPage * query.page, 
                limit: query.perPage
            }
        ).then({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = services;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close;
     } 
}

async function createService(data) {
    const retour = {};
    try{
        const newService = new service(data);
        const categorieId = data.categorie
        const categorie = await findById(categorieId);
        newService.categorie = categorie;
<<<<<<< Updated upstream
        console.log(categorie)
        console.log(newService);
=======
>>>>>>> Stashed changes
        newService.statut = 1;

        await newService.save();
        retour.status = 201;
        retour.message = "Service créé.";
        retour.data = {
            service: newService
        };
        return retour;
    }catch(error){
       throw error;
    }finally{
        mongoose.connection.close
    }    
}

async function modifyService(params, data){
    const retour = data;
    try {
        const filtre = {_id: new ObjectId (params.serviceId)};
        const newData = {$set:{
            nom: data.nom,
            prix: data.prix,
            commission: data.commission,
            duree: data.duree,
            statut: data.statut ?? 1, /* misy statut ve ???? */
            description: data.description,
            categorie: await findById(data.categorie)
        }}
        const updateService = await service.updateOne(filtre, newData);
        retour.status = 200;
        retour.message = "Service mis à jour.";
        retour.data = {
            service: updateService
        };
        return retour
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    }
}

async function modifierStatutService(params, query){
    try {
        const updateService = await service.updateOne({_id: new ObjectId(params.serviceId)}, {$set:{statut: query.statut}});
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        return {
            status : 200,
            message : "Service mis à jour eeee.",
            data:{
                service:updateService
            }
        }
    } catch (error) {
        throw error;   
    }finally{
        mongoose.connection.close
    }
}

async function detailService(params){
    const retour = {};
    try {
        const id = params;
        const findService = await service.find({_id: new ObjectId(params.serviceId)});
        if(findService.length == 1) {
            retour.status = 200;
            retour.message = "";
            retour.data = {
                service: findService[0]
            };
            return retour;
        };
        throw new Error('Service introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}


module.exports = {
    listeService, createService, modifyService, modifierStatutService, detailService
};