const {verifyAccessToken} = require("../service/tokenService");

function authenticateEmployeToken (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            data: "",
            message:"Access non autorisé."
        });
    }
  
    const result = verifyAccessToken(token);

    if(((result.data.type === 'Manager' || result.data.type === 'Client') && !result.statut) || !result.statut || result.data.type !== 'Employé')
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
    authenticateEmployeToken
}
