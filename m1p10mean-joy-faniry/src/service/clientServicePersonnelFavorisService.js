const clientServicePersonnelFavoris = require("../model/clientServicePersonnelFavoris");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const utilisateur = require("../model/utilisateur");
const service = require("../model/service");
const { response } = require("express");



async function createClientPreference(data) {
    const retour = {};
    try{
        const lesFavorisExistant = await clientServicePersonnelFavoris.find(
            {
                'client._id': new ObjectId(data.client),
                'service._id': new ObjectId(data.service),
                statut: true
            }
        );
        if(lesFavorisExistant.length > 0) throw new Error("Ce service est déjà parmi vos favoris");

        const client = await utilisateur.findOne({_id: new ObjectId(data.client)});
        if(client === null) {
            throw new Error('Client introuvable');
        }
        
        const serviceFav = await service.findOne({_id:new ObjectId(data.service)});
        if(serviceFav === null) {
            throw new Error('Service introuvable');
        }

        const lesPers = [];
        if(data.personnel != undefined) {
            console.log("AT V");
            data.personnel.forEach(pers => {
                lesPers.push(new ObjectId(pers))
            }); 
        }

        if(lesPers.length == 0) {
            disablePersonnelIndex({'personnel.mail':1});
        }

        disablePersonnelIndex({'client.mail': 1});

        const personnels = await utilisateur.find({_id:{$in:lesPers}});
        
        data.personnel = personnels;
        data.client = client;
        data.service = serviceFav;
        data.statut = 1;
        
        const favoris = new clientServicePersonnelFavoris(data);
        await favoris.save();

        retour.data = data;
        retour.message = 'Service ajouté aux favoris';
        retour.status = 201;
        return retour;
    }catch(error) {
        throw error;
    }finally{
        mongoose.connection.close;
    }
}

async function listeFavorisClient(params) {
    const retour = {};
    try{
        const fav = await clientServicePersonnelFavoris.find({'client._id': new ObjectId(params.clientId) , statut: true});

        retour.data = fav;
        retour.message = 'OK';
        retour.status = 200;
        return retour;
    }catch(error) {
        throw error;
    }finally{
        mongoose.connection.close;
    }
}

async function updateStatutServiceFav(params,query) {
    try {
        const updateFavoris = await clientServicePersonnelFavoris.updateOne({_id: new ObjectId(params.favId)}, {$set:{statut: query.statut}});

        return {
            status : 200,
            message : "Favoris mis à jour.",
            data:{
                favoris:updateFavoris
            }
        }
    } catch (error) {
        throw error;   
    }finally{
        mongoose.connection.close
    }
}

function disablePersonnelIndex(indexeko)
{
    clientServicePersonnelFavoris.collection.indexes(async (err, indexes) => {
        if (err) {
          throw err;
        } else {
          const indexExists = indexes.some(index => {
            return JSON.stringify(index.key) === JSON.stringify(indexeko);
          });
      
          if (indexExists) {
            await clientServicePersonnelFavoris.collection.dropIndex(indexeko);
          } else {
            console.log('The specified index does not exist. ',indexeko);
          }
        }
    });
}

async function modificationFavoris(params, data){
    const retour = {};
    
    try {
        const lesPers = [];
        if(data.personnel != undefined) {
            data.personnel.forEach(pers => {
                lesPers.push(new ObjectId(pers))
            });
        }
        
        if(lesPers.length == 0)  {
            disablePersonnelIndex({'personnel.mail':1});
        }

        const newPers = await utilisateur.find({_id:{$in:lesPers}});
        const updatePersFavoris = await clientServicePersonnelFavoris.updateOne({_id: new ObjectId(params.favId)}, {$set:{personnel: newPers}});
       
        retour.data = {
            favoris: updatePersFavoris
        };
        retour.status = 200;
        retour.message = "Favoris mis à jour.";
        return retour;
        
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    }
}

module.exports = {createClientPreference,listeFavorisClient,updateStatutServiceFav,modificationFavoris}