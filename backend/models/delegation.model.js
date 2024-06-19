const mongoose = require("mongoose");

const delegationSchema = new mongoose.Schema({
    
    COD_DELEG: Number,
    LIB_DELEG: String,
    COD_GOUV: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'gouvernorats' 
    }
});

module.exports = mongoose.model("delegations", delegationSchema);
