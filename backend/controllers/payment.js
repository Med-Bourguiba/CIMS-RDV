const axios = require("axios");
const Payment = require("../models/payment.model");

const addPayment = async (req, res) => {
    const url = "https://developers.flouci.com/api/generate_payment";
    const payload = {
        "app_token": process.env.PUBLIC_KEY, 
        "app_secret": process.env.SECRET_KEY,
        "amount": req.body.montantFinal,
        "accept_card": "true",
        "session_timeout_secs": 1200,
        "success_link": "http://localhost:3000/success",
        "fail_link": "http://localhost:3000/fail",
        "developer_tracking_id": "2436792b-d12f-461a-ae67-3329f8e58ffd"
    };

    try {
        const result = await axios.post(url, payload);
        res.send(result.data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Error initiating payment", error: err });
    }
};

const verifyPayment = async (req, res) => {
    const id_payment = req.params.id;
    const { numRDV, codBenef, numAnalyse, montant, servicePaye } = req.body;

    try {
        const existingPayment = await Payment.findOne({ TRANSACTION_ID: id_payment });
        if (existingPayment) {
            return res.status(409).send({ message: "Payment already processed" });
        }

        const result = await axios.get(`https://developers.flouci.com/api/verify_payment/${id_payment}`, {
            headers: {
                'Content-Type': 'application/json',
                'apppublic': process.env.PUBLIC_KEY,
                'appsecret': process.env.SECRET_KEY
            }
        });

        if (result.data.result.status === "SUCCESS") {
            const newPayment = new Payment({
                NUM_RDV: numRDV,
                NUM_ANALYSE: numAnalyse,
                DATE_PAIEMENT: new Date(),
                COD_BENEF: codBenef,
                SERVICE_PAYE: servicePaye,
                MNT_PAYE: montant,
                METHOD_PAIEMENT: 'Flouci',
                STATUS_PAIEMENT: 'Success',
                TRANSACTION_ID: id_payment,
                REMARQUE: 'Paiement effectué avec succès'
            });
            await newPayment.save();
            res.send(result.data);
        } else {
            res.status(400).send({ message: "Payment verification failed", result: result.data });
        }
    } catch (err) {
        console.error("Error verifying payment:", err.message);
        res.status(500).send({ message: "Error verifying payment", error: err.message });
    }
};



const checkPayment = async (req, res) => {
    try {
        const { numRDV } = req.params;
        const payment = await Payment.findOne({ NUM_RDV: numRDV });

        if (payment) {
            res.json({ success: true, payment: payment });
        } else {
            res.json({ success: false, message: 'No payment found for this RDV' });
        }
    } catch (err) {
        console.error("Error in checkPayment:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};



const getPaymentDetails = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const paymentDetails = await Payment.findOne({ TRANSACTION_ID: transactionId });
        if (paymentDetails) {
            res.json({ success: true, payment: paymentDetails });
        } else {
            res.status(404).json({ success: false, message: 'Payment details not found' });
        }
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const countPayments = async (req, res) => {
    try {
        const { numRDV } = req.params;
        const count = await Payment.countDocuments({ NUM_RDV: numRDV });

        res.json({ success: true, count: count });
    } catch (err) {
        console.error("Error in countPayments:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};



module.exports = { Add: addPayment, Verify: verifyPayment, checkPayment, getPaymentDetails ,countPayments};
