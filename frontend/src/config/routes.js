import {createBrowserRouter} from 'react-router-dom'
import HomePage from '../pages/home';
import Otp from '../pages/otp';
import FicheInsc from '../pages/fiche_insc';
import NotFoundPage from '../pages/not-found404';
import Success from 'pages/success';
import Fail from 'pages/fail';
import AnalyseDetails from 'pages/analyseDetails';
import RecuPaiment from 'pages/recuPaiment';




const router = createBrowserRouter([
    {
      path : '/',
      element : <div> <HomePage/></div>,
      errorElement : <NotFoundPage/>,
    },
    {
      path : '/otp',
      element : <Otp/>
    },
    {
      path : '/fiche_insc',
      element : <FicheInsc/>
    },
    {
      path : '/success',
      element : <Success/>
    },
    {
      path : '/fail',
      element : <Fail/>
    },
    {
      path : '/analyse',
      element : <AnalyseDetails/>
    },
    {
      path : '/recu_paiment',
      element : <RecuPaiment/>
    }
  ])

  export default router;