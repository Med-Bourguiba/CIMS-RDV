const mongoose = require("mongoose");

const soinAmbSchema = new mongoose.Schema({

        NUM_SOINS: Number,
        COD_BENEF: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'beneficiaires' 
        },
        COD_SERV: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'services' 
        },
        COD_MED: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'medecins' 
        },
        DATE_SOINS: Date,
        HEURE_SOINS: Number,
        COD_DEBIT: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'debiteurs' 
        },
        NUM_CARNET: Number,
        NUM_ASSURE: Number,
        QUAL_ASSURE: String,
        NOM_PREN_AFF: String,
        MNT_PAYE: Number,
        COD_GROUPE: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'groupe_soins' 
        },
        ETAT_SOINS: String,
        DOSS_MEDIC: String,
        MODE_SOINS: String,
        CAUSE_SOINS: String,
        OBSERV1: String,
        OBSERV2: String,
        OBSERV3: String,
        USER_ID: Number,
        DATE_ENREG: Date,
        SEANCE: String,
        RDV: String,
        USER_CREATION: Number,
        DATE_CREATION: Date,
        USER_MAJ: Number,
        DATE_MAJ: Date,
        USER_ANNULE: String,
        DATE_ANNULE: Date,
        FILIERE: String,
        PLAFOND: String,
        COD_ETAB: String,
        NUM_ADM: Number,
        MOTIF_ANNULE: String,
        MODE_SOINS_ACT: String,
        REF_CNAM: String,
        DROIT_CNAM: String,
        BEN_TYPE: String,
        BEN_RANG: String,
        IU_BNF: String,
        BEN_DATN: Date,
        BEN_SEXE: String,
        CAISSE_CNAM: Number
});

module.exports = mongoose.model("soins_amb", soinAmbSchema);
