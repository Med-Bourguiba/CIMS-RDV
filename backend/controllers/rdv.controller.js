const RDV = require("../models/rdv.model");
const SERVICE = require("../models/service.model");
const MEDECIN = require("../models/medecin.model");
const BENEF = require("../models/benef.model");
const DEBIT = require("../models/debiteur.model");
const GRADE = require("../models/grade.model");
const Analyse = require('../models/analyse.model'); 
const RdvAnnule = require("../models/rdv_annulées");
const AnalyseAnnulee = require('../models/analyse_annulées');


const jwt = require('jsonwebtoken');



exports.signin = async (req, res) => {
  const { NUM_RDV, COD_BENEF } = req.body;

  try {
    const rdv = await RDV.findOne({ COD_BENEF: COD_BENEF, NUM_RDV: NUM_RDV });

    if (!rdv) {
      console.log("Aucun rendez-vous trouvé pour les données fournies :", { NUM_RDV, COD_BENEF });
      return res.status(400).json({ message: "Données invalides !" });
    } else {
      console.log("Rendez-vous trouvé :", rdv);
      const token = jwt.sign(
        { data: { id: rdv._id, etatRDV: rdv.ETAT_RDV } },
        process.env.KEY,
        { expiresIn: '5h' }
      );

      console.log("Token généré :", token);
      return res.status(200).json({
        message: "Succès ...",
        token: token,
        rdv: rdv
      });
    }
  } catch (error) {
    console.error("Erreur lors de la recherche du rendez-vous :", error);
    return res.status(500).json({ message: "Erreur serveur lors de la recherche du rendez-vous." });
  }
};



exports.getDataRdv = async (req, res) => {

  try {
    const { COD_SERV, COD_MED, COD_BENEF} = req.body;

    const benef = await BENEF.findOne({ COD_BENEF: COD_BENEF });
    const nomBenef = benef ? benef.NOM_PREN_BENEF : "benef non trouvé";
    const sexeBenef = benef ? benef.SEXE_BENEF : "sexe non trouvé";
    const codDebit = benef ? benef.COD_DEBIT : "debiteur non trouvé";

    const debit = await DEBIT.findOne({ COD_DEBIT: codDebit });
    const libDebit = debit ? debit.LIB_DEBIT : "debiteur non trouvé";


     const service = await SERVICE.findOne({ COD_SERV: COD_SERV });
     const descService = service ? service.DES_SERV : "Service non trouvé";

   
     const medecin = await MEDECIN.findOne({ COD_MED: COD_MED });
     const nomMedecin = medecin ? medecin.NOM_PREN_MED : "Médecin non trouvé";
     const codGrade = medecin ? medecin.COD_GRADE : "grade non trouvé";

     const grade = await GRADE.findOne({ COD_GRADE: codGrade });
     const libGrade = grade ? grade.LIB_GRADE : "grade non trouvé";

     res.json({ descService, nomMedecin, nomBenef, sexeBenef, libDebit, libGrade});

 } catch (error) {
     console.error("Une erreur s'est produite :", error);
     res.status(500).json({ message: "Erreur lors de la récupération des données" });
 }
};



exports.verifierDateRDV = async (req, res) => {
  try {
    const { NUM_RDV, newEtat } = req.body;

    const response = await RDV.findOneAndUpdate(
      { NUM_RDV: NUM_RDV },
      { $set: { ETAT_RDV: newEtat } },
      { new: true }
    );

    if (response) {
      console.log("Réponse de la mise à jour :", response);
      return res.status(200).json({ message: "L'état du RDV a été modifié avec succès.", data: response });
    } else {
      return res.status(404).json({ message: "Aucun rendez-vous trouvé avec le numéro RDV spécifié." });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état du RDV :", error);
    return res.status(500).json({ message: "Erreur lors de la mise à jour de l'état du RDV." });
  }
};







exports.getAnalyseByRdv = async (req, res) => {
    const { NUM_RDV } = req.body;

    try {
        const analyse = await Analyse.findOne({ NUM_RDV: NUM_RDV });
        if (analyse) {
            res.status(200).json(analyse);
        } else {
            res.status(404).json({ message: "Aucune analyse trouvée pour ce numéro de rendez-vous." });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'analyse :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des détails de l'analyse." });
    }
};


exports.supprimer = async (req, res) => {
  const { NUM_RDV } = req.params; // Récupère NUM_RDV depuis les paramètres
  let { user_annulation, raison_annulation } = req.body;
  const date_annulation = new Date();

  try {
    const rdvSupprime = await RDV.findOne({ NUM_RDV }); // Recherche par NUM_RDV
    if (!rdvSupprime) {
      return res.status(404).json({ message: "Rendez-vous non trouvé" });
    }

    let numRdvAnnule = rdvSupprime.NUM_RDV;
    let rdvAnnuleExists = await RdvAnnule.findOne({ NUM_RDV: numRdvAnnule });

    // S'assurer de l'unicité de NUM_RDV
    while (rdvAnnuleExists) {
      numRdvAnnule += '_A';
      rdvAnnuleExists = await RdvAnnule.findOne({ NUM_RDV: numRdvAnnule });
    }

    const nouveauRdvAnnule = new RdvAnnule({
      COD_MED: rdvSupprime.COD_MED,
      COD_BENEF: rdvSupprime.COD_BENEF,
      DATE_RDV: rdvSupprime.DATE_RDV,
      HEURE_RDV: rdvSupprime.HEURE_RDV,
      COD_SERV: rdvSupprime.COD_SERV,
      NUM_RDV: numRdvAnnule,
      NUM_DOSSIER: rdvSupprime.NUM_DOSSIER,
      GSM: rdvSupprime.GSM,
      DATE_ANNULATION: date_annulation,
      USER_ANNULATION: user_annulation,
      RAISON_ANNULATION: raison_annulation || ""
    });

    await nouveauRdvAnnule.save();
    await RDV.findOneAndDelete({ NUM_RDV }); // Suppression par NUM_RDV

    res.status(200).json({ message: "Rendez-vous annulé et supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du rendez-vous :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du rendez-vous" });
  }
};






exports.supprimerAnalyse = async (req, res) => {
  const { NUM_ANALYSE } = req.params;
  const { user_annulation, raison_annulation } = req.body; 
  const date_annulation = new Date();

  console.log(user_annulation);
  console.log(raison_annulation);

  try {
    const analyseSupprimee = await Analyse.findOne({ NUM_ANALYSE });
    if (!analyseSupprimee) {
      return res.status(404).json({ message: "Analyse non trouvée" });
    }

    let numAnalyseAnnulee = analyseSupprimee.NUM_ANALYSE;
    let analyseAnnuleeExists = await AnalyseAnnulee.findOne({ NUM_ANALYSE: numAnalyseAnnulee });

    // S'assurer de l'unicité de NUM_RDV
    while (analyseAnnuleeExists) {
      numAnalyseAnnulee += '_A';
      analyseAnnuleeExists = await AnalyseAnnulee.findOne({ NUM_ANALYSE: numAnalyseAnnulee });
    }

    const nouvelleAnalyseAnnulee = new AnalyseAnnulee({
      NUM_ANALYSE: numAnalyseAnnulee,
      DATE_ANALYSE: analyseSupprimee.DATE_ANALYSE,
      HEURE: analyseSupprimee.HEURE,
      TYPE_ANALYSE: analyseSupprimee.TYPE_ANALYSE,
      DESCRIPTION: analyseSupprimee.DESCRIPTION,
      PRIX: analyseSupprimee.PRIX,
      MEDECIN_RESPONSABLE: analyseSupprimee.MEDECIN_RESPONSABLE,
      NUM_RDV: analyseSupprimee.NUM_RDV,
      DATE_ANNULATION: date_annulation,
      USER_ANNULATION: user_annulation,
      RAISON_ANNULATION: raison_annulation || ""
    });

    await nouvelleAnalyseAnnulee.save();
    await Analyse.findOneAndDelete({ NUM_ANALYSE });

    res.status(200).json({ message: "Analyse annulée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'analyse :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'analyse" });
  }
};
