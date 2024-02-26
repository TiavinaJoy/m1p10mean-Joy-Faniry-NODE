function disableIndex(model, indexeko) {

    // console.log(model);
    model.collection.indexes((err, indexes) => {
        if (err) {
            throw err;
        } else {
            indexes.forEach(async index => {
                if(JSON.stringify(index.key) === JSON.stringify(indexeko)){
                // console.log("DROP INDEX ",indexeko)
                await model.collection.dropIndex(indexeko);
                }else{
                    // console.log('The specified index does not exist. ', indexeko);
                }
            });
        }
    });
}

async function disableAllIndex(model){
    await model.collection.dropIndexes()
}

module.exports = {
    disableIndex, disableAllIndex
}