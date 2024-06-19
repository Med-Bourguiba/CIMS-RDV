import React, { useEffect } from "react";
import { Link, useNavigate} from 'react-router-dom'
import { TiArrowBackOutline } from "react-icons/ti";



const Fail = () => {

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
    }, []); 

    return(
       
       
            <div className="body-success_fail_container">
             <div className="p-4">
                <div className="alert-custom">
        
                <span style={{marginLeft:'215px'}}>PAYMENT REFUSÉ !</span> <br/> Veuillez vérifier les informations de paiement saisies et essayer à nouveau !

                </div>
             </div>
                
                <button className="retour_payment_btn" onClick={() => navigate(-1)} >
                <TiArrowBackOutline size={24}/>Retour à la page de paiement
            </button>
                
              

              <Link to="/fiche_insc" className="link-button-container">
                 <button className="success_fail_btn_btn"><TiArrowBackOutline size={22}/>Retourner au fiche d'inscription</button>
              </Link>


              <div className="image-container-fiche">
                <img src="pci-dss-1.jpg" alt="pci Logo"/>
                <img src="visa-mastercard-logos.jpg" alt="Visa and Mastercard Logos"/>
                <img src="flouci.png" alt="Flouci Logo"/>
                <img src="d17png.png" alt="D17 Logo"/>
            </div>
            </div>
       
        
    );
}


export default Fail;