const role = require("../model/role");
const { mongoose } = require("../configuration/database");
const { ObjectId } = require("mongodb");
const rendezVous = require("../model/rendezVous");
const horairePersonnel = require("../model/horairePersonnel");
const paiement = require("../model/paiement");
const { filtreValidation } = require("../helper/validation");
const { timezoneDateTime } = require("../helper/DateHelper");
const depense = require("../model/depense");


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
        const cursor = await rendezVous.aggregate(pipelineAggregate)

        return {
            data: {data: cursor, aggregate: ""},
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
            data: {data: cursor, aggregate: ""},
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
        const pipelineAggregate =[
          {
            '$project': {
              'year': {
                '$year': '$dateDebut'
              }, 
              'month': {
                '$month': '$dateDebut'
              }, 
              'employe': '$personnel._id', 
              'duration': {
                '$divide': [
                  {
                    '$subtract': [
                      '$dateFin', '$dateDebut'
                    ]
                  }, 1000 * 60 * 60
                ]
              }
            }
          }, {
            '$group': {
              '_id': {
                'year': '$year', 
                'month': '$month', 
                'employee': '$employe'
              }, 
              'totalHours': {
                '$sum': '$duration'
              }
            }
          }, {
            '$group': {
              '_id': {
                'year': '$_id.year', 
                'month': '$_id.month'
              }, 
              'averageHours': {
                '$avg': '$totalHours'
              }
            }
          }
        ];
          
        const cursor = await horairePersonnel.aggregate(pipelineAggregate)
        return {
            data: {data: cursor, aggregate: ""},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}
async function chiffreAffaireParMois(query){
    try {
      const pipelineAggregate = [
        {
          $project: {
            year: {$year: '$createdAt'},
            month: { $month: '$createdAt' }, // Extraire le mois de la date de paiement
            amount: '$facture.prix' // Utiliser le montant du paiement à partir de l'attribut facture
          }
        },
        {
          $group: {
            _id: {
              year: '$year',
              month: '$month'
            },
            totalAmount: { $sum: '$amount' } // Calculer la somme des montants pour chaque mois
          }
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1
          }
        }
      ];
          
        const cursor = await paiement.aggregate(pipelineAggregate)
        return {
            data: {data: cursor, aggregate: ""},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}

async function chiffreAffaireParJour(query){
    try {
      const pipelineAggregate =  [
        {
          $project: {
            year: {$year: '$createdAt'},
            month: { $month: '$createdAt' }, // Extraire le mois de la date de paiement
            day: { $dayOfMonth: '$createdAt' }, // Extraire le mois de la date de paiement
            amount: '$facture.prix' // Utiliser le montant du paiement à partir de l'attribut facture
          }
        },
        {
          $group: {
            _id: {
              year: '$year',
              month: '$month',
              day: '$day'
            },
            totalAmount: { $sum: '$amount' } // Calculer la somme des montants pour chaque mois
          }
        },
        {
          $sort: {
            '_id.year': 1,
            '_id.month': 1,
            '_id.day': 1
          }
        }
      ];
          
        const cursor = await paiement.aggregate(pipelineAggregate)
        return {
            data: {data: cursor, aggregate: ""},
            status: 200,
            message: "OK"
        }
    } catch (error) {
        throw error;
    } finally {
        mongoose.connection.close
    }
}
async function calculerBeneficeParMois(query) {
  try {
    // Agrégation des paiements par mois
    const paiementsParMois = await paiement.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' }, // Extraire le mois de la date de paiement
          year: {$year:'$createdAt'},
          amount: { $subtract: ['$facture.prix', { $multiply: ['$facture.prix', '$facture.rendezVous.service.commission', 0.01] }]} // Utiliser le montant du paiement à partir de l'attribut facture
        }
      },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year'
          },
          totalPayment: { $sum: '$amount' } // Calculer la somme des montants des paiements pour chaque mois
        }
      }
    ]);

    // Agrégation des dépenses par mois
    const depensesParMois = await depense.aggregate([
      {
        $project: {
          month: { $month: '$datePaiement' }, // Extraire le mois de la date de paiement des dépenses
          year: { $year:'$datePaiement'},
          amount: '$montant' // Utiliser le montant de la dépense
        }
      },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year',
          },
          totalExpense: { $sum: '$amount' } // Calculer la somme des montants des dépenses pour chaque mois
        }
      }
    ]);
    // Combinaison des résultats pour calculer le bénéfice
    const beneficeParMois = paiementsParMois.map(paiement => 
      ({
        month: paiement._id.month,
        year: paiement._id.year,
        profit: (paiement.totalPayment || 0) - ((depensesParMois.find(depense => depense._id.month === paiement._id.month &&  depense._id.year === paiement._id.year) || {}).totalExpense || 0)
      })
    );

    return {
      data : beneficeParMois,
      message:"OK",
      status: 200
    }

  } catch (error) {
    console.error('Erreur lors du calcul du bénéfice par mois :', error);
    throw error;
  }finally{
    mongoose.connection.close
  }
}

module.exports = {
    rdvParMois , rdvParJour, tempsMoyenTrav, chiffreAffaireParMois, chiffreAffaireParJour, calculerBeneficeParMois
};