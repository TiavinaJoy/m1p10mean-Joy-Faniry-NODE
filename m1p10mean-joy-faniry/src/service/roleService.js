const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");


async function listeRole() {
    const retour = {};
    try{
        const roles = await role.find({});
        retour.status = 200;
        retour.message = "OK";
        retour.data = roles;
        return retour;
    }catch(error){
        throw error;
     }finally{
         mongoose.connection.close
     } 
}

async function findById(id){
    const retour = id;
    try {
        const roleFound = await role.find({_id: new ObjectId(id)});
        if(roleFound.length == 1) return roleFound[0];
        throw new Error('Rôle introuvable.')
    } catch (error) {
        throw error;
    }finally{
        mongoose.connection.close
    } 
}


module.exports = {
    listeRole, findById
};