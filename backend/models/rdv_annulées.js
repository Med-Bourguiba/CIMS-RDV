const mongoose = require("mongoose");

const rdvAnnuleSchema = new mongoose.Schema({
  COD_MED: {
    type: String,
    required: true
  },
  COD_BENEF: {
    type: String,
    required: true
  },
  DATE_RDV: {
    type: Date,
    required: true
  },
  HEURE_RDV: {
    type: String,
    required: true
  },
  COD_SERV: {
    type: String,
    required: true
  },
  NUM_RDV: {
    type: String,
    required: true,
    unique: true
  },
  NUM_DOSSIER: {
    type: String,
    required: true
  },
  GSM: {
    type: String,
    required: true
  },
  DATE_ANNULATION: {
    type: Date,
    required: true
  },
  USER_ANNULATION: {
    type: String,
    required: true
  },
  RAISON_ANNULATION: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("rdv_annules", rdvAnnuleSchema);
