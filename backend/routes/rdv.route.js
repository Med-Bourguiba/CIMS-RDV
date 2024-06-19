const express = require("express");
const router = express.Router();
const rdvController = require("../controllers/rdv.controller");


router.post("/signin", rdvController.signin);
router.post("/fiche", rdvController.getDataRdv);
router.put("/dateRDV", rdvController.verifierDateRDV);
router.post("/analyse", rdvController.getAnalyseByRdv);
router.post('/annulerRDV/:NUM_RDV', rdvController.supprimer);
router.post('/annulerAnalyse/:NUM_ANALYSE', rdvController.supprimerAnalyse);

module.exports = router;

