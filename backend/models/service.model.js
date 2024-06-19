const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    COD_SERV: String,
    DES_SERV: String,
    ACCES: String
});

module.exports = mongoose.model("services", serviceSchema);
