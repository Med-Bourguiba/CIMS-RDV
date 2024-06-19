import { BsFillShieldLockFill} from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import OtpInput from "otp-input-react";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const Otp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
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
    onSignup();
  }, []);

 

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {

    var rdv_data_str = localStorage.getItem("rdv_data");

    if (rdv_data_str) {
       
        var rdv_data = JSON.parse(rdv_data_str);

            var gsm = rdv_data.GSM;
            console.log(gsm);
        
    }
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+216" + gsm; 

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        Swal.fire({
          position: 'top',
          icon: 'success',
          title: 'Vérifié !',
          showConfirmButton: false,
          timer: 2000
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setOtp("");
        Swal.fire({
          position: 'top',
          title: 'Code incorrect !',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }

    

  return (
    <section className="flex items-center justify-center h-screen body-otp">
      <div>
      
        <div id="recaptcha-container"></div>
        {user ? (
          navigate('/fiche_insc')
        ) : (
          <div className="w-100 flex flex-col gap-4 rounded-lg p-4">
             <div className="flex items-center gap-3 mb-5 mr-3 ml-3">
                <img src="one-time-password.png" alt="" className="h-auto w-9 md:w-10 lg:w-14 xl:w-18" /> {/* Réduction supplémentaire de la taille de l'image */}
                <h1 className="text-center leading-normal text-gray-100 font-bold text-xl mb-0 md:text-2xl lg:text-3xl xl:text-4xl">
                  Vérification OTP
                </h1>

              </div>

              <>
                <div className="bg-white text-blue-600 w-fit mx-auto p-6 rounded-full">
                  <BsFillShieldLockFill size={40} />
                </div>
                <label
                  htmlFor="otp"
                  className="font-bold text-2xl text-gray-100 text-center mt-2"
                >
                  Entrer votre code
                </label>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container"
                ></OtpInput>
                <button
                  onClick={onOTPVerify}
                  className="bg-green-500 hover:bg-green-700 w-full flex gap-2 items-center justify-center py-6 text-white rounded"
                >
                  {loading && (
                    <CgSpinner size={25} className="mt-1 animate-spin" />
                  )}
                  <span className=" font-bold text-xl">Vérifier le code</span>
                </button>
              </>
            
          </div>
        )}
      </div>
    </section>
  );
};

export default Otp;