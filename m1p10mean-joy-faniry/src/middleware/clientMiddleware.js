const {verifyAccessToken} = require("../model/token");

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            data: req.body,
            message:"Access non autorisé."
        });
    }
  
    const result = verifyAccessToken(token);
  
    if(result.type == 'client')
    {
        if (!result.statut) {
            return res.status(403).send({
                data:"",
                message:result.message
            });
        }
    }
    else{
        return res.status(403).send({
            data:"",
            message: "Access non autorisé."
        });
    }
  
    req.user = result.data;
    next();
}

module.exports = {
    authenticateToken
}
