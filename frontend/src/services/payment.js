import axios from 'axios'

const PaymentService = {}


PaymentService.Add = function(data){
    return axios.post('http://localhost:5000/api/payment', data)

}

PaymentService.Verify = function(id, data) {
    return axios.post(`http://localhost:5000/api/payment/${id}`, data);
}

PaymentService.checkPayment = function(numRDV) {
    return axios.get(`http://localhost:5000/api/payment/check/${numRDV}`);
}

PaymentService.getPaymentDetails = function(transactionId){
    return axios.get(`http://localhost:5000/api/payment/details/${transactionId}`);
};

PaymentService.countPayments = function (numRDV) {
    return axios.get(`http://localhost:5000/api/payment/count-payments/${numRDV}`);
};

export default PaymentService;