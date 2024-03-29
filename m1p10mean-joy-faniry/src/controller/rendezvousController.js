const { getError } = require("../helper/error");
const { ajoutRendezVous, getDetailRendezVous, getPersonnelRendezVous, getClientRendezVous, transitRendezVous, getAllRendezVousStatut, updateRendezVous } = require("../service/rendezvousService")

async function addRendezVous(req, res) {
    try {
        const rendesVous = await ajoutRendezVous(req.params, req.body);
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function detailRendezVous(req, res) {
    try {
        const rendesVous = await getDetailRendezVous(req.params);
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function personnelRendezVous(req, res) {
    try {
        const rendesVous = await getPersonnelRendezVous(req.params, req.query);
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function clientRendezVous(req, res) {
    try {
        const rendesVous = await getClientRendezVous(req.params, req.query);
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function rendezVousStatut(req, res) {
    try {
        const rendesVous = await getAllRendezVousStatut();
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}
async function changerStatutRendezVous(req, res) {
    try {
        const rendesVous = await transitRendezVous(req.params);
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}

async function majRendezVous(req, res){
    try {
        const rendesVous = await updateRendezVous(req.params, req.body);
        res.status(rendesVous.status).send({
            "status": rendesVous.status,
            "message": rendesVous.message,
            "data": rendesVous.data
        });
    } catch (error) {
        res.status(getError(error).status).send({
            "status": getError(error).status,
            "message": getError(error).message,
            "data": req.body
        });
    }
}
module.exports = {
    addRendezVous, detailRendezVous, personnelRendezVous, clientRendezVous, changerStatutRendezVous, rendezVousStatut, majRendezVous
};