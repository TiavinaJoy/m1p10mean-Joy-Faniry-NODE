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

function toBoolean(input){
  // input type string
  return  input === '1' ? true : false;
}

function disableIndex(model,indexeko)
{
    console.log(model);
    model.collection.indexes(async (err, indexes) => {
        if (err) {
          throw err;
        } else {
          const indexExists = indexes.some(index => {
            return JSON.stringify(index.key) === JSON.stringify(indexeko);
          });
      
          if (indexExists) {
            await model.collection.dropIndex(indexeko);
          } else {
            console.log('The specified index does not exist. ',indexeko);
          }
        }
    });
}

module.exports = {
    validateEmail,
    isEmpty,
    filtreValidation,
    disableIndex,
    toBoolean
};