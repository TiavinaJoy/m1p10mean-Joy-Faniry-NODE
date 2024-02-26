const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const depense = require("../model/depense");
const { timezoneDateTime } = require("../helper/DateHelper");

async function addDepense(body){
    try {
        const dep = await depense.create([{
            intitule: body.intitule,
            datePaiement: timezoneDateTime(body.datePaiement).toISOString() ?? null,
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
module.exports = {
    addDepense
};