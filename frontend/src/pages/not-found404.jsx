import React from "react";
import { Link } from 'react-router-dom'


const NotFoundPage = () => {

    return(
       
        <div className="page-404">
          <div className="not-found-container">
             <div className="not-found-content">
                
           


                <div className="not-found-image"></div>
                <p>Désolé, la page que vous cherchez n'existe pas ou a été déplacée.</p>
               
                <Link to="/" className="home-link-404">
                <button className="home-button-404">Retourner à la page d'accueil</button>
                </Link>
              
             </div>
         </div>
        </div>                  
       
        
    );
}


export default NotFoundPage;