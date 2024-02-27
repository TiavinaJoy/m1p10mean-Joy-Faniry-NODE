const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const rendezVous = require("../model/rendezVous");
const { filtreValidation } = require("../helper/validation");
const { timezoneDateTime } = require("../helper/DateHelper");


async function rdvParMois(query) {
    const retour = {};
    try {
        const pipelineAggregate = [
            {
                '$project': {
                    'year': {
                        '$year': '$dateRendezVous'
                    },
                    'month': {
                        '$month': '$dateRendezVous'
                    }
                }
            }, {
                '$group': {
                    '_id': {
                        'year': '$year',
                        'month': '$month'
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            }, {
                '$sort': {
                    '_id.year': 1,
                    '_id.month': 1
                }
            }
        ];
        if (filtreValidation(query.dateRendezVousMin) || filtreValidation(query.dateRendezVousMax)) {
            if (filtreValidation(query.dateRendezVousMin) && filtreValidation(query.dateRendezVousMax)) pipelineAggregate.unshift(
                {
                    $match: {
                        dateRendezVous: {

                            $gte: timezoneDateTime(query.dateRendezVousMin).toISOString(),
                            $lte: timezoneDateTime(query.dateRendezVousMax).toISOString(),

                        }
                    }
                })
            else if (filtreValidation(query.dateRendezVousMin) && !filtreValidation(query.dateRendezVousMax)) {
                pipelineAggregate.unshift(
                    {
                        $match: {
                            dateRendezVous: {
                                $gte: timezoneDateTime(query.dateRendezVousMin).toISOString()
                            }
                        }
                    })
            }
            else if (!filtreValidation(query.dateRendezVousMin) && filtreValidation(query.dateRendezVousMax)) {
                pipelineAggregate.unshift({ $match: { dateRendezVous: { $lte: timezoneDateTime(query.dateRendezVousMax).toISOString() } } })
            }
        }
        console.log(pipelineAggregate[0])
        const cursor = await rendezVous.aggregate(pipelineAggregate)

        console.log(cursor.forEach(element => {
            console.log(element)
        }))
        return {
            data: {data: cursor, agg: pipelineAggregate},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}

async function findById(id) {
    const retour = id;
    try {
        const roleFound = await role.find({ _id: new ObjectId(id) });
        if (roleFound.length == 1) return roleFound[0];
        throw new Error('Rôle introuvable.')
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}


module.exports = {
    rdvParMois, findById
};