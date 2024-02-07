/*Function gestion des erreurs de validation et internal serveur error */
function getError(error)
{
    if (error.name === "ValidationError") {
        let errors = {};
        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });
        return {
            status: 400,
            message: errors
        }
    }
    else return {
        status: 500,
        message: error.message
    };
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = {
    getError,
    validateEmail
};