// debiteur.model.js

const mongoose = require("mongoose");

const debiteurSchema = new mongoose.Schema({
   
    COD_DEBIT: String,
    LIB_DEBIT: String,
    COD_TYPE: String
});

module.exports = mongoose.model("debiteurs", debiteurSchema);
