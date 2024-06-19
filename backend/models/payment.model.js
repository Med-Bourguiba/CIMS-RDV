const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    NUM_RDV: { type: String, required: false, ref: 'rdvs' },
    NUM_ANALYSE: { type: String, required: false, ref: 'analyses' },
    DATE_PAIEMENT: { type: Date, default: Date.now },
    COD_BENEF: { type: String, required: true, ref: 'beneficiaires'},
    SERVICE_PAYE: { type: String, required: true },
    MNT_PAYE: { type: Number, required: true },  
    METHOD_PAIEMENT: { type: String, required: true },
    STATUS_PAIEMENT: { type: String, required: true, default: 'Pending' },
    TRANSACTION_ID: { type: String, required: true },
    REMARQUE: { type: String }
});

module.exports = mongoose.model("payments", paymentSchema);


