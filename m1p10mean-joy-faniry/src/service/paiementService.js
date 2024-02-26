const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const facture = require("../model/facture");
const utilisateur = require("../model/utilisateur");
const paiement = require("../model/paiement");
const { filtreValidation } = require("../helper/validation");
const { timezoneDateTime } = require("../helper/DateHelper");
const { disableAllIndex } = require("../helper/removeIndex");


async function ajoutPaiement(params) {
    const retour = {};
    try {
        await disableAllIndex(paiement);
        if((await paiement.exists({"facture._id": new ObjectId(params.factureId)})) !== null){
            return {
                message: "Facture déjà payé",
                status: 400,
                data:""
            }
        }
        const factures = await facture.findOne({ _id: new ObjectId(params.factureId) });
        if (factures !== null) {
            const debiteur = await utilisateur.findOne({ _id: new ObjectId(params.clientId) })
            if (debiteur !== null) {
                const paiementToAdd = new paiement({
                    facture: factures,
                    payeur: debiteur
                }) ;
                const paiementAdded = await paiementToAdd.save();
                retour.status = 201;
                retour.message = "Paiement réussi";
                retour.data = paiementAdded;
                return retour;
            } else {
                throw new Error("utilisateur introuvable.")
            }
        } else {
            throw new Error("Facture introuvable.")
        }
       
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}

async function getListePaiement(query){
    try {
        const filtre = {};
        const test = filtreValidation(query.datePaiementMin);
        if(filtreValidation(query.datePaiementMin) || filtreValidation(query.datePaiementMax)){
            if(filtreValidation(query.datePaiementMin) && filtreValidation(query.datePaiementMax)) filtre.createdAt ={
                $gte: query.datePaiementMin, 
                $lte: query.datePaiementMax
            }
            else if (filtreValidation(query.datePaiementMin) && !filtreValidation(query.datePaiementMax)) filtre.createdAt = {$gte: timezoneDateTime(query.datePaiementMin).toISOString()}
            else if (!filtreValidation(query.datePaiementMin) && filtreValidation(query.datePaiementMax)) filtre.createdAt = {$lte: timezoneDateTime(query.datePaiementMax).toISOString()}
        }
        if(filtreValidation(query.payeur)) filtre["payeur._id"] = new ObjectId(query.payeur);
        if(filtreValidation(query.facture)) filtre["facture._id"] = new ObjectId(query.facture);
        const paiements = await paiement.find(filtre);
        return {
            status :200,
            message: "OK",
            data: paiements
        }
    } catch (error) {
        throw error
    }finally{
        mongoose.connection.close
    }
}

module.exports = {
    ajoutPaiement, getListePaiement
};