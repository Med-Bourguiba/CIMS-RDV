import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RdvService from '../services/rdvService';
import PaymentService from '../services/payment';
import { RiBankCardFill } from "react-icons/ri";
import { FaFileMedicalAlt } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import ErrorIcon from '@mui/icons-material/Error';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField,Typography, Button ,Box} from '@mui/material';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import { toast ,ToastContainer} from 'react-toastify';
const moment = require('moment');

const FicheInsc = () => {
  const [connectedUser, setConnectedUser] = useState({});
  const [descService, setDescService] = useState("");  
  const [nomMedecin, setNomMedecin] = useState("");
  const [nomBenef , setNomBenef] = useState("");
  const [sexeBenef , setSexeBenef] = useState("");
  const navigate = useNavigate();
  const hopital = localStorage.getItem('selectedHospital');
  const [libDebit , setLibDebit] = useState("");
  const [libGrade , setLibGrade] = useState("");
  const [montant, setMontant] = useState(0);
  const [montantFinal, setMontantFinal] = useState(0);
  const [montantTransforme, setMontantTransforme] = useState(0);
  const [analyse, setAnalyse] = useState(null);
  const [paiementEffectue, setPaiementEffectue] = useState({});
  const [paymentCount, setPaymentCount] = useState(0);
  const [disablePayment, setDisablePayment] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [annuleDetails, setAnnuleDetails] = useState(null);
  


  const getConnectedUserData = () => {
    const userData = JSON.parse(localStorage.getItem('rdv_data'));
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/');
      return;
    }

    setConnectedUser(userData);
  };

  useEffect(() => {
    const canceledRdv = localStorage.getItem('annuleDetails');
    if (canceledRdv) {
      setAnnuleDetails(JSON.parse(canceledRdv));
    } else {
      getConnectedUserData();
    }
  }, [libGrade, libDebit, montant]); 

  useEffect(() => {
    const getDataRDV = async () => {
      const data = {
        COD_SERV: connectedUser.COD_SERV,
        COD_MED: connectedUser.COD_MED,
        COD_BENEF: connectedUser.COD_BENEF,
      };
  
      console.log('DATA:', data);
  
      try {
        const response = await RdvService.getDataRdv(data);
        console.log('response ==>', response);
  
        setDescService(response.data.descService);
        setNomMedecin(response.data.nomMedecin);
        setNomBenef(response.data.nomBenef);
        setSexeBenef(response.data.sexeBenef);
        setLibDebit(response.data.libDebit);
        setLibGrade(response.data.libGrade);

        localStorage.setItem('descService', response.data.descService);
        localStorage.setItem('nomMedecin', response.data.nomMedecin);
        localStorage.setItem('nomBenef', response.data.nomBenef);
        localStorage.setItem('sexeBenef', response.data.sexeBenef);
        localStorage.setItem('libDebit', response.data.libDebit);

        console.log('Description du service:', response.data.descService);
        console.log('Nom du médecin:', response.data.nomMedecin);
        console.log('Nom du Beneficiaire:', response.data.nomBenef);
        console.log('Sexe du Beneficiaire:', response.data.sexeBenef);
      } catch (err) {
        console.log(err);
      }
    };
  
    getDataRDV();
  }, [connectedUser]);
  

  
   
  useEffect(() =>{
    const calculeMontant = (libGrade) => {
      switch (libGrade) {
        case "PROFESSEUR":
          setMontant(14);
          break;
        case "MAITRE CONFERENCE AGREGE":
        case "MEDECIN SPECIALISTE PRINCIPALE":
        case "MEDECIN SPECIALISTE":
        case "MEDECIN PRINCIPAL":
          setMontant(10);
          break;
        case "ASSISTANT HOSPITALO UNIVERCITAIRE":
        case "MEDECINS HOPITAUX":
        case "MEDECIN SANTE PUBLIQUE":
        case "MEDECIN SPECIALISTE DE LA SANTE PUBLIQUE":
        case "MCA":
        case "INFIRMIER":
          setMontant(7);
          break;
        default:
          setMontant(0);
      }
    };
    
    const calculerMontantFinal = (libDebit) => {
      switch (libDebit) {
        case "BLESSES PALESTINIENS":
        case "ASSIT.MED GRATUITE 1":
        case "MALADIES SOCIALES":
        case "ASSIT.MED GRATUITE 2":
          setMontantFinal(0);
          break;
        case "PERSONNEL DE LA SANTE PUBLIQUE":
        case "CNRPS (CARNET DE SOINS)":
        case "CNSS + CAVIS (CARNET DE SOINS)":
          setMontantFinal(montant / 2);
          break;
        case "PLEIN TARIF":
        case "PRISE EN CHARGE":
        case "COOPERATION INTERNATIONALE":
          setMontantFinal(montant);
          break;
        default:
          setMontantFinal(0);
      }
    };
    
    calculeMontant(libGrade);
    calculerMontantFinal(libDebit);
  }, [libGrade, libDebit, montant]);

  

  useEffect(() => {
    const checkPaymentStatus = async () => {
        if (connectedUser && connectedUser.NUM_RDV) {
            try {
                const response = await PaymentService.checkPayment(connectedUser.NUM_RDV);
                if (response.data && response.data.payment) {
                    setPaiementEffectue(response.data.payment);
                }
            } catch (err) {
                console.error('Failed to check payment:', err);
            }
        }
    };

    checkPaymentStatus();
}, [connectedUser]);

useEffect(() => {
  const fetchAnalyse = async () => {
    if (connectedUser.NUM_RDV) {
      const response = await RdvService.getAnalyseByRdv({ NUM_RDV: connectedUser.NUM_RDV });
      if (response.data) {
        setAnalyse(response.data);
      }
    }
  };    

  fetchAnalyse();
}, [connectedUser]);

useEffect(() => {
  const countPayments = async () => {
    if (connectedUser && connectedUser.NUM_RDV) {
      try {
        const response = await PaymentService.countPayments(connectedUser.NUM_RDV);
        if (response.data && response.data.success) {
          setPaymentCount(response.data.count);
        }
      } catch (err) {
        console.error('Failed to count payments:', err);
      }
    }
  };

  countPayments();
}, [connectedUser]);

useEffect(() => {
  // Si l'état est "P", désactiver les boutons de paiement
  if (connectedUser.ETAT_RDV === "P") {
    setDisablePayment(true);
  }
}, [connectedUser]);

const goToAnalyseDetails = () => {
  navigate('/analyse', { state: { analyse } });
};

useEffect(() => {
  if (analyse && analyse.PRIX) {
    const prixAnalyse = Number(analyse.PRIX);
    const calcul = (montantFinal + prixAnalyse) * 1000;
    setMontantTransforme(calcul);
  } else {
    setMontantTransforme(montantFinal * 1000); 
  }
}, [montantFinal, analyse]);

const deconnecter = () => {
  localStorage.clear();
  navigate("/");
};

const updatePaymentInfo = (connectedUser, analyse, montantTransformeFinal, servicePaye) => {
  const existingPaymentInfo = localStorage.getItem('paymentInfo');
  let paymentInfo = {};

  if (existingPaymentInfo) {
      paymentInfo = JSON.parse(existingPaymentInfo);
  }

  // Mettre à jour les informations de paiement
  paymentInfo.numRDV = connectedUser.NUM_RDV;
  paymentInfo.codBenef = connectedUser.COD_BENEF;
  paymentInfo.numAnalyse = analyse ? analyse.NUM_ANALYSE : null;
  paymentInfo.montant = montantTransformeFinal;
  paymentInfo.servicePaye = servicePaye;

  localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
};

const paymentTotalEnLigne = async () => {
  const service = "analyse & consultation";
  const montantTransformeFinal = montantTransforme;

  updatePaymentInfo(connectedUser, analyse, montantTransformeFinal, service);

  const data = {
    montantFinal: montantTransforme, 
  };

  try {
    console.log('montant ==>', montantTransforme);
    const response = await PaymentService.Add(data);
    console.log('response ==>', response.data);
    const {result} = response.data;
    window.location.href = result.link;
  } catch (err) {
    console.error("Error during payment:", err);
    if (err.response) {
      console.log("Error data:", err.response.data);
    }
  }
};

// payé consultation seulement
const paymentEnLigne = async () => {
  const service ="consultation";
  const montantTransformeFinal = montantFinal * 1000;

  updatePaymentInfo(connectedUser, analyse, montantTransformeFinal, service);

  const data = {
    montantFinal: montantTransformeFinal, 
  };

  try {
    console.log('montant ==>', montantTransformeFinal);
    const response = await PaymentService.Add(data);
    console.log('response ==>', response.data);
    const {result} = response.data;
    window.location.href = result.link;
  } catch (err) {
    console.error("Error during payment:", err);
    if (err.response) {
      console.log("Error data:", err.response.data);
    }
  }
};

const payerAnalyse = async () => {
  const service = "analyse";
  const montantTransforme = analyse.PRIX * 1000;

  updatePaymentInfo(connectedUser, analyse, montantTransforme, service);

  const data = {
    montantFinal: montantTransforme, 
  };

  try {
    console.log('montant ==>', analyse.PRIX);
    const response = await PaymentService.Add(data);
    console.log('response ==>', response.data);
    const { result } = response.data;
    window.location.href = result.link;
  } catch (err) {
    console.error("Error during payment:", err);
    if (err.response) {
      console.log("Error data:", err.response.data);
    }
  }
};


const verifierDateRDV = async () => {
  const dateAujourdhui = new Date();
  const data = {
    NUM_RDV: connectedUser.NUM_RDV,
  };

  // Convertir la date de rendez-vous en format Date
  const dateRDV = moment(connectedUser.DATE_RDV, 'DD/MM/YYYY').toDate();

  // Vérifier les dates dans la console pour le débogage
  console.log("Date RDV:", dateRDV);
  console.log("Date Aujourd'hui:", dateAujourdhui);

  // Assurer que les objets de date sont correctement formatés
  if (dateRDV instanceof Date && !isNaN(dateRDV) && dateAujourdhui instanceof Date && !isNaN(dateAujourdhui)) {
    if (dateAujourdhui > dateRDV && connectedUser.ETAT_RDV === "E") {
      try {
        const paymentResponse = await PaymentService.checkPayment(connectedUser.NUM_RDV);

        // Vérifier le statut de paiement et changer l'état si nécessaire
        if (!paymentResponse.data.payment || (paymentResponse.data.payment.SERVICE_PAYE !== "consultation" && paymentResponse.data.payment.SERVICE_PAYE !== "analyse & consultation")) {
          const newEtat = "P"; // Passé

          const rdvResponse = await RdvService.verifierDateRDV({ ...data, newEtat });

          console.log("Réponse du serveur:", rdvResponse.data);

          if (rdvResponse.data && rdvResponse.data.message === "L'état du RDV a été modifié avec succès.") {
            // Mettre à jour l'état local et localStorage
            const updatedUser = {
              ...connectedUser,
              ETAT_RDV: newEtat,
            };
            localStorage.setItem('rdv_data', JSON.stringify(updatedUser)); // Mettre à jour les données dans localStorage
            setConnectedUser(updatedUser); // Mettre à jour l'état React
            console.log("Rendez-vous passé, les boutons doivent être désactivés");
            setDisablePayment(true); // Désactiver les boutons de paiement
          }
        } else {
          console.log("Le paiement a été effectué, aucun changement d'état requis.");
        }
      } catch (error) {
        console.error('Erreur lors de la modification de l\'état du RDV :', error);
      }
    } else {
      console.log('Les conditions ne sont pas remplies pour mettre à jour l\'état du RDV.');
      console.log('connectedUser.ETAT_RDV:', connectedUser.ETAT_RDV);
      console.log('dateAujourdhui > dateRDV:', dateAujourdhui > dateRDV);
    }
  } else {
    console.error("Invalid date format detected.");
  }
};


useEffect(() => {
  if (connectedUser && connectedUser.NUM_RDV) {
    verifierDateRDV();
  }
}, [connectedUser]);

  console.log("disablePayment state:", disablePayment);



  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelReason("");
  };

  const handleCancelRDV = async () => {
    if (!cancelReason.trim()) {
      toast.error("La raison de l'annulation est obligatoire.", { position: "top-right",className: 'toast-custom' });
      return;
    }
  
    try {
      const user_annulation = nomBenef;
      await RdvService.supprimer(connectedUser.NUM_RDV, { user_annulation, raison_annulation: cancelReason });
      toast.success("Rendez-vous annulé avec succès", { position: "top-right" ,className: 'toast-custom'});
      const annuleData = {
        ...connectedUser,
        DATE_ANNULATION: new Date().toLocaleDateString(),
        RAISON_ANNULATION: cancelReason,
        
      };
  
      setAnnuleDetails(annuleData);
      localStorage.setItem('annuleDetails', JSON.stringify(annuleData));
      handleCloseCancelDialog();
      console.log(annuleDetails);
      
    } catch (error) {
      console.error("Erreur lors de l'annulation du rendez-vous :", error);
      toast.error("Erreur lors de l'annulation du rendez-vous", { position: "top-right", className: 'toast-custom' });
    }
  };

  

  return (
    <div>
      <ToastContainer />
      <button className="btn-deconnexion" onClick={deconnecter}><FiLogOut className='icon-dec-icon' size={20} /> Déconnexion</button>

      {(moment(connectedUser.DATE_RDV, 'DD/MM/YYYY').toDate() > new Date()) && !annuleDetails && (
        <button className="btn-annuler-rdv" onClick={handleOpenCancelDialog}><BackspaceOutlinedIcon style={{ marginRight: '10px', fontSize: '20px' }} /> Annuler RDV</button>
      )}

      <div className="background-image-fiche flex items-center justify-center h-screen">

        <div className='container-ficheInsc'>

          <div className='img-fiche'>
            { sexeBenef === "M" ? (
              <img className='img-rdv' src='AM.png' alt='' />
            ) : (
              <img className='img-rdv' src='AF.png' alt='' />
            )}
          </div>

          <div className='details-fiche'>
            

            {annuleDetails ? (
              <>
                <div className='titre-fiche-insc' style={{marginLeft:'70px',marginTop:'25px', marginBottom:'25px'}}>
                  <img className='paper-icon' src='un-journal.png' alt='' />
                  <h1>
                    <b>Détails du Rendez-vous annulé</b>
                  </h1>
                </div>
                
                <h3><b>Nom & Prénom du patient :</b> {localStorage.getItem('nomBenef')}</h3>
                <h3><b>Service :</b> {localStorage.getItem('descService')}</h3>
                <h3><b>Débiteur :</b> {localStorage.getItem('libDebit')}</h3>
                <h3><b>Nom & Prénom Médecin :</b> Dr {localStorage.getItem('nomMedecin')}</h3>
                <h3><b>Numéro du RDV :</b> {annuleDetails.NUM_RDV}</h3>
                <h3><b>Date d'annulation :</b> {annuleDetails.DATE_ANNULATION}</h3>
                <h3><b>Raison de l'annulation :</b> {annuleDetails.RAISON_ANNULATION}</h3>

                {analyse && (
                  <>
                    <h3 style={{marginTop:"70px"}}><b>Analyse :</b> {analyse.TYPE_ANALYSE}</h3>
                    <div style={{ display: 'flex', gap: '175px' }}>
                      <h3><b>Prix analyse :</b> {analyse.PRIX} TND</h3>
                      <div >
                        <button style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }} className='button-analyse' onClick={goToAnalyseDetails}><FaFileMedicalAlt />Plus de détails</button>
                      </div>
                    </div>
                  </>
                )}
                
              </>
            ) : (
              <>
                <div className='titre-fiche-insc'>
                  <img className='paper-icon' src='un-journal.png' alt='' />
                  <h1 >
                    <b>Détails du Rendez-vous</b>
                  </h1>
                </div>
                {sexeBenef === "M" ? (
                  <h3><b>Mr</b>  {nomBenef}</h3>
                ) : (
                  <h3><b>Mme </b> {nomBenef} </h3>
                )}
                
                <h3><b>Service :</b>  {descService}</h3>
                <h3><b>Débiteur :</b> {libDebit}</h3>
                <h3><b>Nom & Prénom Médecin :</b> Dr {nomMedecin}</h3>
                {analyse && (
                  <>
                    <h3><b>Analyse :</b> {analyse.TYPE_ANALYSE}</h3>
                    <div style={{ display: 'flex', gap: '175px' }}>
                      <h3><b>Prix analyse :</b> {analyse.PRIX} TND</h3>
                      <div >
                        <button style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }} className='button-analyse' onClick={goToAnalyseDetails}><FaFileMedicalAlt />Plus de détails</button>
                      </div>
                    </div>
                  </>
                )}
                <h3><b>Date rendez-vous : </b>Le {connectedUser.DATE_RDV} </h3>
                <h3><b>Heure :</b> {connectedUser.HEURE_RDV} h</h3>
                {connectedUser.ETAT_RDV === "C" ? (
                  <h3><b>Etat :</b> Consultée</h3>
                ) : connectedUser.ETAT_RDV === "P" ? (
                  <>
                    <div style={{ display: 'flex', gap: '50px', alignItems: 'center', justifyContent: 'center' }}>
                      <h3><b>Etat :</b> <span style={{ color: '#ff0a0a' }}> Passé </span></h3>
                      <h3 style={{ color: 'red', display: 'flex', alignItems: 'center' }}>
                        <b><ErrorIcon style={{ marginRight: '10px', fontSize: '18px' }} /> La date de consultation est passée, veuillez prendre un nouveau rendez-vous à l'hôpital responsable.</b>
                      </h3>
                    </div>


                  </>
                ) : (
                  <h3><b>Etat :</b> En attente</h3>
                )}
                <h3><b>Numéro rendez-vous :</b> {connectedUser.NUM_RDV} </h3>
                {connectedUser.DATE_ANNULATION === "" ? (
                  <></>
                ) : (
                  <h3><b>Date Annulation : </b>Le {connectedUser.DATE_ANNULATION}</h3>
                )}

                {(connectedUser.ETAT_RDV === "C" || (paiementEffectue.SERVICE_PAYE === "analyse & consultation" || paiementEffectue.SERVICE_PAYE === "consultation")) ? (
                  <>
                    <h3><b>Montant de consultation payé : </b> {montantFinal} TND</h3>

                    {analyse && (paiementEffectue.SERVICE_PAYE === "analyse & consultation" || paymentCount === 4) && (  // paymentcount khatr 3ana deux document na3rfouch 3la chkoun bch ytasti donc nwaliw namlou : count(2) 4 car dupliqée
                      <>
                        <h3><b>Montant Total payé : <br />"consultation & analyse" : </b> {montantTransforme / 1000} TND</h3>
                      </>
                    )}

                    {analyse && paymentCount !== 4 && paiementEffectue.SERVICE_PAYE !== "analyse" && paiementEffectue.SERVICE_PAYE === "consultation" && (
                      <div className='payement'>
                        <div style={{ display: 'flex', alignItems: "center" }}>
                          {new Date(analyse.DATE_ANALYSE) < new Date() && analyse.RESULTATS === "" && (
                            <h3 style={{ color: 'red' }}><ErrorIcon style={{ marginRight: '7px', fontSize: '18px' }} /><b>Le rendez-vous pour l'analyse est passé.</b></h3>
                          )}
                          <button className='button-analyse-payer-fiche' onClick={payerAnalyse}
                            disabled={new Date(analyse.DATE_ANALYSE) < new Date() && analyse.RESULTATS === ""}>
                            <RiBankCardFill size={16} /> Payer l'Analyse
                          </button>
                        </div>
                      </div>
                    )}

                  </>
                ) : (
                  <>
                    {paymentCount === 4 ? (
                      <>
                        <h3><b>Montant de consultation payé : </b> {montantFinal} TND</h3>
                        <h3><b>Montant Total payé : <br />"consultation & analyse" : </b> {montantTransforme / 1000} TND</h3>
                      </>
                    ) : (
                      <>
                        <div className='payement'>
                          <h3><b>Montant de consultation <br /> à payer : </b> {montantFinal} TND</h3>
                          <button className='payer-btn icon-pay' onClick={paymentEnLigne} disabled={disablePayment}>
                            <RiBankCardFill className='icon-pay-icon' size={20} /> Payer Consultation
                          </button>
                        </div>
                        {analyse && paiementEffectue.SERVICE_PAYE !== "analyse" && new Date(analyse.DATE_ANALYSE) > new Date() ? (
                          <>
                            <div className='payement'>
                              <h3><b>Montant Total à payer : </b> {montantTransforme / 1000} TND</h3>
                              <button className='payer-btn-total icon-pay' onClick={paymentTotalEnLigne} disabled={disablePayment}>
                                <RiBankCardFill className='icon-pay-icon' size={20} /> Payer Total
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className='payement'>
                              <h3><b>Montant Total à payer : </b> {montantFinal} TND</h3>
                              <button className='payer-btn-total icon-pay' onClick={paymentEnLigne} disabled={disablePayment}>
                                <RiBankCardFill className='icon-pay-icon' size={20} /> Payer Total
                              </button>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

              </>
            )}
          </div>
        </div>
      </div>

      <div className="image-container-fiche">
        <img src="pci-dss-1.jpg" alt="pci Logo" />
        <img src="visa-mastercard-logos.jpg" alt="Visa and Mastercard Logos" />
        <img src="flouci.png" alt="Flouci Logo" />
        <img src="d17png.png" alt="D17 Logo" />
      </div>

      <Dialog sx={{
        '& .MuiDialog-paper': {
          width: '40%',
          maxWidth: '400px',
        },
      }} maxWidth="md" fullWidth open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', fontSize: '20px', color: 'red' }}>
            Êtes-vous sûr de vouloir annuler ce rendez-vous ?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box my={2}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Veuillez fournir une raison pour l'annulation <span style={{ color: 'red' }}> *</span> :
            </Typography>
            <TextField

              label="Raison de l'annulation"
              fullWidth
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              required
              multiline
              rows={3}
              variant="outlined"
              margin="normal"
              InputProps={{
                style: { fontSize: 18 },
              }}
              InputLabelProps={{
                style: { fontSize: 16 },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelDialog} variant="outlined">Non</Button>
          <Button onClick={handleCancelRDV} color="primary" variant="contained" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}>
            Oui
          </Button>

        </DialogActions>
      </Dialog>



    </div>
  );
};

export default FicheInsc;