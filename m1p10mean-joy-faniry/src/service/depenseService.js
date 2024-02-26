const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const depense = require("../model/depense");
const { timezoneDateTime } = require("../helper/DateHelper");
const { filtreValidation } = require("../helper/validation");

async function addDepense(body){
    try {
        const daty = new Date();
        daty.setHours(daty.getHours() + 3); 
        console.log(daty);
        const dep = await depense.create([{
            intitule: body.intitule,
            datePaiement: filtreValidation(body.datePaiement) ? timezoneDateTime(body.datePaiement).toISOString() : daty.toISOString(),
            type: body.typeDepense,
            montant: body.montant
        }])
        return {
            data:dep,
            message:"Dépense enregistré",
            status:201
        }
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}

async function getDepense(query){
    try {
        const filtre = {};
        if(filtreValidation(query.datePaiementMin) || filtreValidation(query.datePaiementMax)){
            if(filtreValidation(query.datePaiementMin) && filtreValidation(query.datePaiementMax)) filtre.datePaiement ={
                
                $gte: timezoneDateTime(query.datePaiementMin).toISOString(), 
                $lte: timezoneDateTime(query.datePaiementMax).toISOString(),
                
            }
            else if (filtreValidation(query.datePaiementMin) && !filtreValidation(query.datePaiementMax)) {
                filtre.datePaiement = {$gte:  timezoneDateTime(query.datePaiementMin).toISOString()}
            }  
            else if (!filtreValidation(query.datePaiementMin) && filtreValidation(query.datePaiementMax)) { 
                filtre.datePaiement = {$lte: timezoneDateTime(query.datePaiementMax).toISOString()} 
            }
        }
        if(filtreValidation(query.typeDepense)) filtre.type = query.typeDepense
        if(filtreValidation(query.montantMin) || filtreValidation(query.montantMax)){
            if(filtreValidation(query.montantMin) && filtreValidation(query.montantMax)) filtre.montant ={
                
                $gte: query.montantMin, 
                $lte: query.montantMax,
                
            }
            else if (filtreValidation(query.montantMin) && !filtreValidation(query.montantMax)) {
                filtre.montant = {$gte:  query.montantMin}
            }  
            else if (!filtreValidation(query.montantMin) && filtreValidation(query.montantMax)) { 
                filtre.montant = {$lte:query.montantMax} 
            }
        }
        console.log(filtre)
        const depenses = await depense.find(filtre);
        return {
            data:depenses,
            message:"OK",
            status:200
        }
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}
module.exports = {
    addDepense, getDepense
};