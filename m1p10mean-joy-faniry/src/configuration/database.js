require("dotenv").config();
const mongoose = require("mongoose");
const dbURI = process.env.DATABASE_URL;

async function connection() {
  try{
    await mongoose.connect(dbURI,{
        useNewUrlParser : true,
        useUnifiedTopology: true
    });
    console.log("Connecté à la base de donnée MongoDB");
  }catch(error) {
    throw error;
  }
}

module.exports = {
  connection,
  mongoose
}