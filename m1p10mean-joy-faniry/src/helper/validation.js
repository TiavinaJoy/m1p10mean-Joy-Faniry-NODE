function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isEmpty(mdp) {
    return (mdp == null || (typeof mdp === "string" && mdp.trim().length === 0)); 
}

function filtreValidation(element) {
    if(element && element.localeCompare('')!=0 && element !== undefined) return true;
    return false;
}

module.exports = {
    validateEmail,
    isEmpty,
    filtreValidation
};