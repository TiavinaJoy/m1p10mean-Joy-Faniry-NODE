const {verifyAccessToken} = require("../service/tokenService");

function authenticateManagerToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            data: req.body,
            message:"Access non autorisé."
        });
    }
  
    const result = verifyAccessToken(token);

    if(((result.data.type === 'employe' || result.data.type === 'client') && !result.statut) || !result.statut || result.data.type !== 'manager')
    {
        return res.status(403).send({
            data:"",
            message: "Access non autorisé."
        });
    }
  
    req.user = result.data;
    next();
}

module.exports = {
    authenticateManagerToken
}
