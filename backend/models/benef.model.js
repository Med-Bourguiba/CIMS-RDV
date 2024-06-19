const mongoose = require("mongoose");

const benefSchema = new mongoose.Schema({

        COD_BENEF: String,
        NOM_PREN_BENEF: String,
        DATE_NAI_BENEF: String,
        SEXE_BENEF: String,
        COD_ETAT_CIV: String,
        COD_NAT: {
            type: mongoose.Schema.Types.String,  //string au lieu du ObjectId
            ref: 'nationalites' 
        },
        ADR_BENEF: String,
        COD_LOC_ADR: String,
        COD_LOC: String,
        DATE_ENREG: String,
        PREN_PERE_BENEF: String,
        PREN_MERE_BENEF: String,
        ETAT_BENEF: String,
        PREN_BENEF: String,
        COD_DELEG: {
            type: mongoose.Schema.Types.String,
            ref: 'delegations' 
        },
        USER_CREATION: String,
        DATE_CREATION: String,
        USER_MAJ: String,
        DATE_MAJ: String,
        NUM_DM: String,
        COD_DEBIT :String
});

module.exports = mongoose.model("beneficiaires", benefSchema);
