function disableIndex(model, indexeko) {

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
                console.log('The specified index does not exist. ', indexeko);
            }
        }
    });
}

module.exports = {
    disableIndex
}