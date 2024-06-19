const mongoose = require("mongoose");

const analyseAnnuleeSchema = new mongoose.Schema({
  NUM_ANALYSE: {
    type: String,
    required: true,
    unique: true
  },
  NUM_RDV: {
    type: String,
    required: true
  },
  TYPE_ANALYSE: {
    type: String,
    required: true
  },
  DESCRIPTION: {
    type: String,
    required: true
  },
  PRIX: {
    type: Number,
    required: true
  },
  DATE_ANALYSE: {
    type: Date,
    required: true
  },
  MEDECIN_RESPONSABLE: {
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
    required: true,
    default: ''
  }
});

module.exports = mongoose.model("analyse_annulees", analyseAnnuleeSchema);
