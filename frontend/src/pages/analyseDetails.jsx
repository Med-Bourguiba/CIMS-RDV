import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { RiBankCardFill } from "react-icons/ri";
import ErrorIcon from '@mui/icons-material/Error';
import { FiLogOut } from "react-icons/fi";
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import PaymentService from '../services/payment';
import RdvService from '../services/rdvService';
import { toast, ToastContainer } from 'react-toastify';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Button, Box } from '@mui/material';

const AnalyseDetails = () => {
  const { state } = useLocation();
  const { analyse } = state;
  const navigate = useNavigate();

  const handleRetour = () => {
    navigate('/fiche_insc');
  };

  const [connectedUser, setConnectedUser] = useState({});
  const [paiementEffectue, setPaiementEffectue] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
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
    const annuleAnalyseDetails = localStorage.getItem('annuleAnalyseDetails');
    if (annuleAnalyseDetails) {
      setAnnuleDetails(JSON.parse(annuleAnalyseDetails));
    } else {
      getConnectedUserData();
    }
  }, []);

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
    const checkPaymentStatus = async () => {
      if (connectedUser && connectedUser.NUM_RDV) {
        try {
          const response = await PaymentService.checkPayment(connectedUser.NUM_RDV);
          if (response.data && (response.data.payment.SERVICE_PAYE === "analyse & consultation" || response.data.payment.SERVICE_PAYE === "analyse" || paymentCount === 4)) {
            setPaiementEffectue(true);
          }
        } catch (err) {
          console.error('Failed to check payment:', err);
        }
      }
    };

    checkPaymentStatus();
  }, [connectedUser, paymentCount]); // Ajout de paymentCount comme dépendance

  const updatePaymentInfo = (connectedUser, analyse, montantTransforme, servicePaye) => {
    const existingPaymentInfo = localStorage.getItem('paymentInfo');
    let paymentInfo = {};

    if (existingPaymentInfo) {
      paymentInfo = JSON.parse(existingPaymentInfo);
    }

    // Mettre à jour les informations de paiement
    paymentInfo.numRDV = connectedUser.NUM_RDV;
    paymentInfo.codBenef = connectedUser.COD_BENEF;
    paymentInfo.numAnalyse = analyse ? analyse.NUM_ANALYSE : null;
    paymentInfo.montant = montantTransforme;
    paymentInfo.servicePaye = servicePaye;

    localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
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

  const isDatePassed = new Date(analyse.DATE_ANALYSE) < new Date();

  const handleOpenCancelDialog = () => {
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setCancelReason("");
  };
  

  const handleCancelAnalyse = async () => {
    if (!cancelReason.trim()) {
      toast.error("La raison de l'annulation est obligatoire.", { position: "top-right", className: 'toast-custom' });
      return;
    }

    try {
      const user_annulation = localStorage.getItem('nomBenef');
      console.log('User Annulation:', user_annulation);  
      console.log('Cancel Reason:', cancelReason);       
      
      if (!user_annulation) {
        toast.error("Le nom du bénéficiaire n'est pas trouvé.", { position: "top-right", className: 'toast-custom' });
        return;
      }

      const analyseDetails = {
        NUM_ANALYSE: analyse.NUM_ANALYSE,
        DATE_ANALYSE: analyse.DATE_ANALYSE,
        HEURE: analyse.HEURE,
        TYPE_ANALYSE: analyse.TYPE_ANALYSE,
        DESCRIPTION: analyse.DESCRIPTION,
        PRIX: analyse.PRIX,
        MEDECIN_RESPONSABLE: analyse.MEDECIN_RESPONSABLE,
        NUM_RDV: connectedUser.NUM_RDV,
        DATE_ANNULATION: new Date().toLocaleDateString(),
        USER_ANNULATION: user_annulation,
        RAISON_ANNULATION: cancelReason,
      };

      localStorage.setItem('annuleAnalyseDetails', JSON.stringify(analyseDetails));

      await RdvService.supprimerAnalyse(analyse.NUM_ANALYSE, { user_annulation, raison_annulation: cancelReason });
      toast.success("Analyse annulée avec succès", { position: "top-right", className: 'toast-custom' });

      setAnnuleDetails(analyseDetails);

      handleCloseCancelDialog();
      console.log(annuleDetails);

    } catch (error) {
      console.error("Erreur lors de l'annulation de l'analyse :", error);
      toast.error("Erreur lors de l'annulation de l'analyse", { position: "top-right", className: 'toast-custom' });
    }
  };


  const deconnecter = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className='analyse-background'>
      <ToastContainer />
      <button className="btn-deconnexion" onClick={deconnecter}><FiLogOut className='icon-dec-icon' size={20} /> Déconnexion</button>
      {!isDatePassed && !annuleDetails &&
        <button className="btn-annuler-analyse" onClick={handleOpenCancelDialog}><BackspaceOutlinedIcon style={{ marginRight: '10px', fontSize: '20px' }} /> Annuler l'analyse</button>
      }

      <div className="analyse-details">
        
        {annuleDetails ? (
          <>
          <h1 style={{ display: 'flex', gap: '7px', alignItems: 'center', justifyContent: 'center' }}>
            <img className='paper-icon' src='analyse1.png' alt='' /> Détails d'Analyse annulée
          </h1>
            <p><b>Numéro d'Analyse:</b> {annuleDetails.NUM_ANALYSE}</p>
            <p><b>Type d'Analyse:</b> {annuleDetails.TYPE_ANALYSE}</p>
            <p><b>Description:</b> {annuleDetails.DESCRIPTION}</p>
            <p><b>Date:</b> {new Date(annuleDetails.DATE_ANALYSE).toLocaleDateString()}</p>
            <p><b>Heure:</b> {annuleDetails.HEURE}h</p>
            <p><b>Prix:</b> {annuleDetails.PRIX} TND</p>
            <p><b>Médecin Responsable:</b> {annuleDetails.MEDECIN_RESPONSABLE}</p>
            <p><b>Numéro du RDV:</b> {annuleDetails.NUM_RDV}</p>
            <p><b>Date d'annulation:</b> {annuleDetails.DATE_ANNULATION}</p>
            <p><b>Raison de l'annulation:</b> {annuleDetails.RAISON_ANNULATION}</p>
            <button className='button-analyse_annulée-retour' onClick={handleRetour}>
                <IoIosArrowBack size={16} />Retour au fiche d'inscription
            </button>
          </>
        ) : (
          <>
          <h1 style={{ display: 'flex', gap: '7px', alignItems: 'center', justifyContent: 'center' }}>
            <img className='paper-icon' src='analyse1.png' alt='' /> Détails de l'Analyse
          </h1>
            <p><b>Numéro d'Analyse:</b> {analyse.NUM_ANALYSE}</p>
            <p><b>Type d'Analyse:</b> {analyse.TYPE_ANALYSE}</p>
            <p><b>Description:</b> {analyse.DESCRIPTION}</p>
            <p><b>Date:</b> {new Date(analyse.DATE_ANALYSE).toLocaleDateString()}</p>
            <p><b>Heure:</b> {analyse.HEURE}h</p>
            <p><b>Prix:</b> {analyse.PRIX} TND</p>
            <p><b>Médecin Responsable:</b> {analyse.MEDECIN_RESPONSABLE}</p>
            {isDatePassed && paiementEffectue && analyse.RESULTATS !== "" && (
              <>
                <p><b>Résultats:</b> {analyse.RESULTATS}</p>
                <p><b>Validée:</b> {analyse.VALIDEE ? 'Oui' : 'Non'}</p>
              </>
            )}
            {isDatePassed && !paiementEffectue && (
              <>
                <p style={{ color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><b> <ErrorIcon style={{ marginRight: '10px', fontSize: '18px' }} />Le rendez-vous pour l'analyse est passé. Veuillez prendre un nouveau rendez-vous à l'hôpital responsable pour effectuer votre analyse.</b></p>
              </>
            )}
            {paiementEffectue && (
              <p><b>Montant d'analyse payé :</b> {analyse.PRIX} TND</p>
            )}

            <div style={{ display: "flex", gap: "30px" }}>
                <button className='button-analyse-retour' onClick={handleRetour}>
                  <IoIosArrowBack size={16} />Retour au fiche d'inscription
                </button>

                {!paiementEffectue && (
                  <button className='button-analyse-payer' onClick={payerAnalyse} disabled={isDatePassed && !paiementEffectue}>
                    <RiBankCardFill size={16} /> Payer l'Analyse
                  </button>
                )}
            </div>
          </>
        )}

        
      </div>

      <Dialog sx={{
        '& .MuiDialog-paper': {
          width: '40%',
          maxWidth: '400px',
        },
      }} maxWidth="md" fullWidth open={cancelDialogOpen} onClose={handleCloseCancelDialog}>
        <DialogTitle>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', fontSize: '20px', color: 'red' }}>
            Êtes-vous sûr de vouloir annuler cette analyse ?
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
          <Button onClick={handleCancelAnalyse} color="primary" variant="contained" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}>
            Oui
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AnalyseDetails;
