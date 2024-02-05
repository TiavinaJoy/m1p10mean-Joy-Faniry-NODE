const {inscription} = require("../service/clientService");

async function register( req , res ) {
    try{
        await inscription(req.body);
        res.status(200).send({
            "message":"User added",
            "data": {}
        });
    }catch(error){
        res.send({
            "message": error,
            "data": {}
        });
    }
}

module.exports = {
    register
}