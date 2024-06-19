const mongoose = require("mongoose");

const specialiteSchema = new mongoose.Schema({
    COD_SPEC: Number,
    LIB_SPEC: String
});

module.exports = mongoose.model("specialites", specialiteSchema);
