import axios from 'axios'

const RdvService = {}


RdvService.signIn = function(data){
    return axios.post('http://localhost:5000/rdvs/signin' , data)

}

RdvService.getDataRdv = function(data){
    return axios.post('http://localhost:5000/rdvs/fiche' , data)

}

RdvService.getAnalyseByRdv = function(data){
    return axios.post('http://localhost:5000/rdvs/analyse' , data)

}

RdvService.verifierDateRDV = function(data){
    return axios.put('http://localhost:5000/rdvs/dateRDV' , data)

}

RdvService.supprimer = function (NUM_RDV, data) {
    return axios.post(`http://localhost:5000/rdvs/annulerRDV/${NUM_RDV}`, { data });
};

RdvService.supprimerAnalyse = function (NUM_ANALYSE, data) {
    return axios.post(`http://localhost:5000/rdvs/annulerAnalyse/${NUM_ANALYSE}`, data);
};

export default RdvService;