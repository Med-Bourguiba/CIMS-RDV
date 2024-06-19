const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    
    COD_GRADE: String,
    LIB_GRADE: String
});

module.exports = mongoose.model("grades", gradeSchema);
