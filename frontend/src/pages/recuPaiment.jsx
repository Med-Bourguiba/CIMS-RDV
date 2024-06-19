import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentService from "services/payment";
import { FcPrint } from "react-icons/fc";
import { IoIosArrowBack } from "react-icons/io";




const RecuPaiment = () => {
    const [paymentDetails, setPaymentDetails] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        const transactionId = localStorage.getItem('transactionId');  
        if (transactionId) {
            PaymentService.getPaymentDetails(transactionId).then(response => {
                if (response.data.success) {
                    setPaymentDetails(response.data.payment);
                }
            }).catch(err => console.error('Failed to fetch payment details:', err));
        }
    }, []);

    const handlePrint = () => {
        window.print();
    };

        
    const handleRetour = () => {
        navigate('/fiche_insc'); 
    };

    if (!paymentDetails) return <div>Loading payment details...</div>;

    return (
        <>
        <button className='button-recu-retour' onClick={handleRetour}>
            <IoIosArrowBack size={16} />Retour au fiche d'inscription
          </button>
        <div className="recu-container">
            
            <div className="recu" id="section-to-print">
                <h1>Reçu de Paiement</h1>
                <p><strong>Code de Transaction:</strong> {paymentDetails.TRANSACTION_ID}</p>
                <p><strong>Date de Transaction:</strong> {new Date(paymentDetails.DATE_PAIEMENT).toLocaleDateString()}</p>
                <p><strong>service payé:</strong> {paymentDetails.SERVICE_PAYE}</p>
                <p><strong>Montant Payé:</strong> {paymentDetails.MNT_PAYE / 1000} TND</p>
                <p><strong>Méthode de Paiement:</strong> {paymentDetails.METHOD_PAIEMENT}</p>
                <p><strong>Statut:</strong> {paymentDetails.STATUS_PAIEMENT}</p>
            </div>
            <button onClick={handlePrint} className="recu-button">
            <FcPrint />Imprimer le reçu
            </button>
        </div>
        </>
        
    );
};

export default RecuPaiment;
