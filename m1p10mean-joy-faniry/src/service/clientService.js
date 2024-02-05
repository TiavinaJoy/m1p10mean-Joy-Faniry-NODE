const client = require("../model/client");
const db = require("../configuration/database");
/*Inscription utilisateur*/
async function inscription(data) {
    try{
        const newClient = new client(data);
        /*bcrypt.genSalt(10, async (err,salt) => {
            const hash =  await bcrypt.hash(data.mdp, salt);
            newClient.mdp = hash;
            newClient.save();
        });*/
        await newClient.save();
    }catch(error){
        throw error;
        /*console.log(error.errors.email.kind);*/
    }
}
/*Export de la class UserService */
module.exports = {
    inscription,
};