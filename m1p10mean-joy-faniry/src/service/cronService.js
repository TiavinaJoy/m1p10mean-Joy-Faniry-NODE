const cron = require('node-cron');
const {chercheRdv} = require ('./mailService');
const cronJob = cron.schedule('*/1 * * * *', async () => {
  // Votre code à exécuter toutes les 5 minutes va ici
  console.log('EXEC CRON');
  try {
    await chercheRdv();  
  } catch (error) {
    console.log(error);
  }
  
});
function startCron(){
    cronJob.start();
}

module.exports = {
    startCron,
}