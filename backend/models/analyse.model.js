const mongoose = require("mongoose");

const analyseSchema = new mongoose.Schema({
  NUM_ANALYSE: {
    type: String,
    required: true,
    unique: true
  },
  NUM_RDV: {
    type: String,
    required: true,
    ref: 'rdvs'  
  },
  TYPE_ANALYSE: {
    type: String,
    required: true
  },
  DESCRIPTION: {
    type: String,
    required: false
  },
  PRIX: {
    type: Number,
    required: true
  },
  DATE_ANALYSE: {
    type: Date,
    default: Date.now
  },
  RESULTATS: {
    type: String,
    required: false
  },
  MEDECIN_RESPONSABLE: {
    type: String,
    required: true
  },
  VALIDEE: {
    type: Boolean,
    default: false
  },
  HEURE: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("analyses", analyseSchema);
