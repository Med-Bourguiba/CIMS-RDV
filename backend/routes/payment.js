const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment"); 

router.post("/payment", paymentController.Add);
router.post("/payment/:id", paymentController.Verify);
router.get('/payment/check/:numRDV', paymentController.checkPayment);
router.get('/payment/details/:transactionId', paymentController.getPaymentDetails);
router.get('/payment/count-payments/:numRDV', paymentController.countPayments);



module.exports = router;