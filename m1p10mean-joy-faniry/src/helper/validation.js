function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isEmpty(mdp) {
    return (mdp == null || (typeof mdp === "string" && mdp.trim().length === 0)); 
}

module.exports = {
    validateEmail,
    isEmpty
};