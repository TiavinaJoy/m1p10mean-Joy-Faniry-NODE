require("dotenv").config();
const jwt = require('jsonwebtoken');
const date = require('date-and-time');

function generateAccessToken(user,type) {
    const expirationDate = new Date();
    //date.format(expirationDate, 'YYYY/MM/DD HH:mm:ss');  
    //date.addDays(expirationDate,3);
    expirationDate.setDate(expirationDate.getDate() + 3);

    const payload = {
      id: user._id,
      email: user.mail,
      dateExpiration: expirationDate,
      type: type
    };
    const secret = process.env.SECRET_KEY;

    const exp = process.env.EXPIRATION + 'd';

    const options = { expiresIn:  exp};

    return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
    const secret = process.env.SECRET_KEY;
    const retour = {};
    try {
      const decoded = jwt.verify(token, secret);
      const today = new Date();
      date.format(today,'YYYY/MM/DD HH:mm:ss');
      const expiration = new Date(decoded.dateExpiration);
      const diff = date.subtract(expiration,today).toDays();

      if(diff < 0) {
        retour.statut = false;
        retour.data = decoded;
        retour.message = 'Token expiré.';
      }
      else if (diff >= 0) {
        retour.statut = true;
        retour.data = decoded;
        retour.message = 'Succes.';
      }
    } catch (error) {
        retour.statut = false;
        retour.data = "";
        retour.message = 'Error. ',error;
    }
    return retour;
}

module.exports = {
    generateAccessToken,
    verifyAccessToken
};