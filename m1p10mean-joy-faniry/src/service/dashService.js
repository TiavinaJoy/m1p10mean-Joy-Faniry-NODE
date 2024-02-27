const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const rendezVous = require("../model/rendezVous");
const horairePersonnel = require("../model/horairePersonnel");
const { filtreValidation } = require("../helper/validation");
const { timezoneDateTime } = require("../helper/DateHelper");


async function rdvParMois(query) {
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
            data: {data: cursor, aggregate: pipelineAggregate},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}

async function rdvParJour(query){
    try {
        const pipelineAggregate = [
            {
              $project: {
                year: { $year: '$dateRendezVous' },
                month: { $month: '$dateRendezVous' },
                day: { $dayOfMonth: '$dateRendezVous' } // Ajoutez cette étape pour extraire le jour du mois
              }
            },
            {
              $group: {
                _id: {
                  year: '$year',
                  month: '$month',
                  day: '$day' // Utilisez le jour du mois comme clé de groupe
                },
                count: { $sum: 1 }
              }
            },
            {
              $sort: {
                '_id.year': 1,
                '_id.month': 1,
                '_id.day': 1 // Triez par année, mois, puis jour
              }
            }
          ];
        const cursor = await rendezVous.aggregate(pipelineAggregate)

        console.log(cursor.forEach(element => {
            console.log(element)
        }))
        return {
            data: {data: cursor, aggregate: pipelineAggregate},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}
async function tempsMoyenTrav(query){
    try {
        const pipelineAggregate = [
            {
              $project: {
                year: { $year: '$dateDebut' },
                month: { $month: '$dateDebut' },
                duration: {
                  $divide: [
                    { $subtract: ['$dateFin', '$dateDebut'] }, // Calculer la durée en millisecondes
                    1000 * 60 * 60 // Convertir en heures
                  ]
                } 
              }
            },
            {
              $group: {
                _id: {
                  year: '$year',
                  month: '$month',
                  employee: '$employé' // Grouper par mois et employé
                },
                totalHours: { $sum: '$duration' } // Calculer la somme des heures de travail pour chaque employé
              }
            },
            {
              $group: {
                _id: {
                  year: '$_id.year',
                  month: '$_id.month'
                },
                averageHours: { $avg: '$totalHours' } // Calculer la moyenne des heures de travail pour chaque mois
              }
            },
            {
              $sort: {
                '_id.year': 1,
                '_id.month': 1
              }
            }
          ];
          
        const cursor = await horairePersonnel.aggregate(pipelineAggregate)
        return {
            data: {data: cursor, aggregate: pipelineAggregate},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}


module.exports = {
    rdvParMois , rdvParJour, tempsMoyenTrav
};