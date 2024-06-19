import React, {useEffect, useState} from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import PaymentService from "services/payment";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoReceiptSharp } from "react-icons/io5";

const Success = () => {

    const [searchParams] = useSearchParams();
    const [result, setResult] = useState("");
    const [isVerified, setIsVerified] = useState(false); 
    const navigate = useNavigate();

    const getConnectedUserData = () => {
        
        const token = localStorage.getItem('token');

        if (!token) {
        navigate('/');
        return;
        }

    };



    useEffect(() => {

        getConnectedUserData();     

    },[]);


    useEffect(() => {
        const paymentId = searchParams.get("payment_id");
        if (paymentId) {
            localStorage.setItem('transactionId', paymentId);
        }

        const verifierSuccess = async () => {
            if (!isVerified) {
                try {
                    const id_payment = searchParams.get("payment_id");
                    const paymentInfo = JSON.parse(localStorage.getItem('paymentInfo'));

                    if (paymentInfo) {
                        const { numRDV, codBenef, numAnalyse, montant, servicePaye } = paymentInfo;
                        const data = { numRDV, codBenef, numAnalyse, montant, servicePaye };

                        const response = await PaymentService.Verify(id_payment, data);
                        setResult(response.data.result.status);
                        setIsVerified(true);
                    }
                } catch (err) {
                    console.error("Error during verification:", err);
                }
            }
        };

        verifierSuccess();
    }, [isVerified, searchParams]);

    return(
       <>
       {result === "SUCCESS" &&(
           <div className="body-success_fail_container">
             <div className="p-4">
                 <div className="alert-success-custom" style={{padding:'38px'}}>
            
                  <span style={{marginLeft:'23px'}}>PAIEMENT ACCEPTÉ !</span> <br/> Merci pour votre transaction.
    
                 </div>
            </div>
               <div style={{display: 'flex', gap:'40px', alignItems:'center'}}>
                    <Link to="/fiche_insc" className="link-button-container">
                    <button className="success_fail_btn_btn"><TiArrowBackOutline size={22}/>Retourner au fiche d'inscription</button>
                    </Link>
                    <Link to="/recu_paiment" className="link-button-container">
                    <button className="success_fail_btn_recu"><IoReceiptSharp size={22}/>Voir le reçu du paiement</button>
                    </Link>
                </div> 
             
             <div className="image-container-fiche">
                <img src="pci-dss-1.jpg" alt="pci Logo"/>
                <img src="visa-mastercard-logos.jpg" alt="Visa and Mastercard Logos"/>
                <img src="flouci.png" alt="Flouci Logo"/>
                <img src="d17png.png" alt="D17 Logo"/>
            </div>

           </div>
       )}
          
       </>
                        
       
        
    );
}


export default Success;