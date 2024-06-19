const mongoose = require("mongoose");

const medecinSchema = new mongoose.Schema({
    COD_MED: String,
    NOM_PREN_MED: String,
    DATE_NAISS_MED: String,
    SEXE_MED: String,
    COD_NAT: {
        type: mongoose.Schema.Types.String,
        ref: 'nationalites' 
    },
    COD_STAT: String,
    COD_SPEC: {
        type: mongoose.Schema.Types.String,
        ref: 'specialites' 
    },
    COD_GRADE: {
        type: mongoose.Schema.Types.String,
        ref: 'grades' 
    },
    COD_SERV: {
        type: mongoose.Schema.Types.String,
        ref: 'services' 
    },
    ADR_MED: String,
    TEL1_MED: String,
    TEL2_MED: String,
    ACCES: String,
    COD_GROUPE: {
        type: mongoose.Schema.Types.String,
        ref: 'groupe_soins' 
    }
});

module.exports = mongoose.model("medecins", medecinSchema);
