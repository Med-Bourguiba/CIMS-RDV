import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import RdvService from '../services/rdvService';
import { FaRegPenToSquare } from "react-icons/fa6";


const HomePage = () => {
  const navigate = useNavigate();
  const [NUM_RDV, setNUM_RDV] = useState('');
  const [COD_BENEF, setCOD_BENEF] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  
  const login = async (e) => {
    e.preventDefault();

    if (!NUM_RDV || !COD_BENEF) {
      Swal.fire({
        position: 'top',
        title: 'Index et Num RDV sont obligatoires !',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const data = {
      NUM_RDV: NUM_RDV,
      COD_BENEF: COD_BENEF,
      selectedHospital: selectedHospital 
    };

   

    try {
      const response = await RdvService.signIn(data);
      console.log('response ==>', response);
  

      localStorage.setItem('rdv_data', JSON.stringify(response.data.rdv));
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('selectedHospital', selectedHospital); 

      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'OTP envoyé avec succès !',
        showConfirmButton: false,
        timer: 3000
      });

      setNUM_RDV('');
      setCOD_BENEF('');

      navigate('/otp')

    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message;
      Swal.fire({
        position: 'top',
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal'
        }
      });
      
    }
  };



  return (
      <div>
          <section id="header">
        <div className="header container">
        <div className="nav-bar">
            <div className="brand">
            <a href="#hero">
                <div className='title-logo'>
            <img className='logo1' src='logo.jpg' alt=''/>
            <h1 className='h1-titre-logo'><span>C</span>im<span>s</span> la santé pour tous</h1>
            </div>
            
          </a>
        </div>
        <div className="nav-list">
          <div className="hamburger">
            <div className="bar"></div>
          </div>
          <ul>
            <li><a href="#hero" data-after="Home">Accueil</a></li>
            <li><a href="#projects" data-after="Service">Services</a></li>
            <li><a href="#contact" data-after="Projects">aide</a></li>
            <li><a href="#contact" data-after="Contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  </section>
            <section id="hero">
    <div className="hero container">
      <div className='form-discription'>


      <div className='paragraphe1'>
      <h1>Bonjour, <span></span></h1>
        <h1>Avez vous<span></span></h1>
        <h1>un rendez-vous? <span></span></h1>
        <a href="#contact" type="button" className="cta">Besoin d'aide ?</a>
      </div>
       


        
        <div className='register'>
            <div className='register-content'>
        
            <div className='iconetitle'>
            <FaRegPenToSquare className='iconInsert'/><p className='sous-titre'> Inserer vos coordonnées</p>
            </div>
            
                
                <div className='form-container-home'>
                    <form onSubmit={login}>
                    

                        <div className='form-group' style={{marginTop:'50px'}}>
                        
                            <label>Num RDV<span style={{ color: 'red' }}>*</span></label>
                            <input className='input' placeholder='entrer votre numero du rendez-vous' type="text" value={NUM_RDV} onChange={(e)=>setNUM_RDV(e.target.value)}/>
                            
                        </div>

                        

                        <div className='form-group'>
                            <label>Index<span style={{ color: 'red' }}>*</span></label>
                            <input className='input' placeholder='entrer votre index' type="password" value={COD_BENEF} onChange={(e)=>setCOD_BENEF(e.target.value)}/>
                
                        </div>

                    

                        <button className='btn' type='submit'>Connection</button>
                    </form>
                </div>
             
         </div> 

     </div>
      </div>
    </div>
  </section>

  {/*<section id="services">
    <div class="services container">
      <div class="service-top">
        <h1 class="section-title">Serv<span>i</span>ces</h1>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum deleniti maiores pariatur assumenda quas
          magni et, doloribus quod voluptate quasi molestiae magnam officiis dolorum, dolor provident atque molestias
          voluptatum explicabo!</p>
      </div>
      <div class="service-bottom">
        <div class="service-item">
          <div class="icon"><img src="https://img.icons8.com/bubbles/100/000000/services.png" /></div>
          <h2>Web Design</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis debitis rerum, magni voluptatem sed
            architecto placeat beatae tenetur officia quod</p>
        </div>
        <div class="service-item">
          <div class="icon"><img src="https://img.icons8.com/bubbles/100/000000/services.png" /></div>
          <h2>Web Design</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis debitis rerum, magni voluptatem sed
            architecto placeat beatae tenetur officia quod</p>
        </div>
        <div class="service-item">
          <div class="icon"><img src="https://img.icons8.com/bubbles/100/000000/services.png" /></div>
          <h2>Web Design</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis debitis rerum, magni voluptatem sed
            architecto placeat beatae tenetur officia quod</p>
        </div>
        <div class="service-item">
          <div class="icon"><img src="https://img.icons8.com/bubbles/100/000000/services.png" /></div>
          <h2>Web Design</h2>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis debitis rerum, magni voluptatem sed
            architecto placeat beatae tenetur officia quod</p>
        </div>
      </div>
    </div>
  </section>*/}
 
  <section id="projects">
    <div className="projects container">
      <div className="projects-header">
        <h1 className="section-title">Nos <span>services</span></h1>
      </div>
      <div className="all-projects">
        <div className="project-item">
          <div className="project-info">
            <h1>Authentification Sécurisée</h1>
            <p> L'authentification est une étape cruciale pour garantir la sécurité de votre compte. 
              Pour accéder aux fonctionnalités de consultation et de paiement en ligne, 
              veuillez saisir votre identifiant ainsi que le code OTP (One-Time Password) qui vous sera envoyé par SMS. 
              Ce processus garantit que seuls les utilisateurs autorisés peuvent accéder à leurs informations médicales
               et effectuer des transactions en toute sécurité.</p>
          </div>
          <div className="project-img">
            <img src="authentifié.jpg" alt="img"/>
          </div>
        </div>
        <div className="project-item">
          <div className="project-info">
            <h1>Consultation de Rendez-vous Médicaux </h1>
            <p>Notre application offre une interface conviviale pour la consultation de vos rendez-vous médicaux.
               Une fois authentifié, vous pourrez accéder à votre fiche d'inscription de rendez-vous, consulter les détails de chaque rendez-vous, 
               y compris le nom du médecin, la date, l'heure et le motif de la consultation. 
            </p>
          </div>
          <div className="project-img">
            <img src="consulter.jpg" alt="img"/>
          </div>
        </div>
        <div className="project-item">
          <div className="project-info">
            <h1>Paiement en Ligne Sécurisé </h1>
            <p>Simplifiez le processus de paiement de vos consultations médicales en utilisant notre système de paiement en ligne 
              sécurisé. Après avoir confirmé votre rendez-vous, vous serez redirigé vers notre plateforme de paiement sécurisée
               où vous pourrez effectuer votre transaction en toute confiance. Nous acceptons plusieurs modes de paiement 
               pour votre commodité (Carte Bancaire, Carte Postal D17, Flouci wallet), assurant ainsi une expérience sans tracas.</p>
          </div>
          <div className="project-img">
            <img src="payement en ligne.jpg" alt="img"/>
          </div>
        </div>
        <div className="project-item">
          <div className="project-info">
            <h1>Tarification Transparente</h1>
            <p> Pour garantir une expérience utilisateur transparente, tous les frais de consultation sont clairement affichés
               avant que vous ne confirmiez votre rendez-vous. Vous saurez exactement combien vous devrez payer avant d'effectuer
                le paiement en ligne. Si vous avez des questions concernant les tarifs des consultations ou les méthodes
                 de paiement acceptées, n'hésitez pas à consulter notre service d'assistance.</p>
          </div>
          <div className="project-img">
            <img src="tarifaction.jpg" alt="img"/>
          </div>
        </div>
        <div className="project-item">
          <div className="project-info">
            <h1>Service d'Assistance et Support </h1>
            <p>Nous comprenons que vous puissiez avoir des questions ou des préoccupations lors de l'utilisation de notre application.
               Notre équipe de support dévouée est là pour vous aider à tout moment. Si vous rencontrez des problèmes techniques,
                des difficultés avec le processus de paiement ou si vous avez simplement besoin d'aide pour naviguer dans l'application, 
                vous pouvez contacter notre équipe d'assistance pour une aide personnalisée.</p>
          </div>
          <div className="project-img">
            <img src="img-1.png" alt="img"/>
          </div>
        </div>
      </div>
    </div>
  </section>
  

 
  <section id="contact">
    <div className="contact container">
      <div>
        <h1 className="section-title">Contactez<span>-nous</span></h1>
      </div>
      <div className="contact-items">
        <div className="contact-item">
          <div className="icon"><img style={{ width: "50px", height: "50px" }} src="https://cdn-icons-png.flaticon.com/128/8377/8377433.png" alt='' /></div>
          <div className="contact-info">
            <h1>Téléphone</h1>
            <h2>+216 71 789 855</h2>
          </div>
        </div>
        <div className="contact-item">
          <div className="icon"><img style={{ width: "50px", height: "50px" }} src="https://cdn-icons-png.flaticon.com/128/732/732200.png" alt='' /></div>
          <div className="contact-info">
            <h1>Email</h1>
            <h2>cims@rns.tn</h2>
          </div>
        </div>
        <div className="contact-item">
          <div className="icon"><img style={{ width: "50px", height: "50px" }} src="https://cdn-icons-png.flaticon.com/128/2775/2775980.png" alt='' /></div>
          <div className="contact-info">
            <h1>Adresse</h1>
            <h2>1 Rue du Liberia , Jeanne d'Arc, Tunis 1002</h2>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <section id="footer">
    <div className="footer container">
      <div className="brand">
        
        <h1><span>C</span>IM<span>S</span></h1>
        
      </div>
      
      
      <div className="social-icon">
        <div className="social-item">
          <a href="http://www.cims.tn"><img src="https://cdn-icons-png.flaticon.com/128/8743/8743996.png" alt=''/></a>
        </div>
      </div>
      <p>Centre Informatique du Ministère de la Santé</p>
      <p>Copyright © 2024 CIMS. Tous droits réservés</p>
    </div>
  </section>
  
      </div>
    
    
    






















  
  );
};

export default HomePage;
