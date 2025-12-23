const Transaction = require('../models/transactionModel');
const { initializePayment, verifyPayment } = require('../utils/paystack');

// 1. Initialize Payment
exports.initPayment = async (req, res) => {
    try {
        const { email, amount } = req.body;

        // Validation
        if (!email || !amount) {
            return res.status(400).json({ message: "Email and amount are required" });
        }

        const data = {
            email,
            amount: amount * 100, // Paystack works in Kobo
            callback_url: 'http://localhost:5173/payment-success'
        };

        // Call Paystack Utility
        const paystackRes = await initializePayment(data);
        
        if (paystackRes.error) {
            return res.status(400).json({ message: "Paystack initialization failed", error: paystackRes.error });
        }

        // Save transaction to Database with "pending" status
        await Transaction.create({
            email,
            amount,
            reference: paystackRes.data.reference,
            status: 'pending' 
        });

        // Return the URL for the frontend to redirect the user
        return res.json({ 
            authorization_url: paystackRes.data.authorization_url 
        });

    } catch (err) {
        console.error("Init Error:", err.message);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// 2. Verify Payment
exports.verifyPay = async (req, res) => {
    try {
        const { reference } = req.params;

        // Call Paystack Utility to check real status
        const paystackRes = await verifyPayment(reference);
        
        if (paystackRes.error) {
            return res.status(400).json({ message: "Verification request failed", error: paystackRes.error });
        }

        const paystackStatus = paystackRes.data.status; // e.g., 'success' or 'abandoned'

        // Find the record in your database
        const trx = await Transaction.findOne({ reference });
        if (!trx) {
            return res.status(404).json({ message: 'Transaction record not found in database' });
        }

        // Update database with the latest status from Paystack
        trx.status = paystackStatus;
        await trx.save();

        // Return status to your Frontend (paymentSuccess.jsx)
        return res.json({ 
            status: paystackStatus,
            data: paystackRes.data 
        });

    } catch (err) {
        console.error("Verify Error:", err.message);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const callback_url = process.env.NODE_ENV === 'production'
? 'https://farmapp.vercel.com/payment-success'
: 'http://localhost:5173/payment-success'