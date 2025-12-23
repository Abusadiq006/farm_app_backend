const axios = require('axios');

const initializePayment = async (form) => {
    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize', 
            form, 
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        return { error: error.response?.data || error.message };
    }
};

const verifyPayment = async (reference) => {
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`, 
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );
        return response.data;
    } catch (error) {
        return { error: error.response?.data || error.message };
    }
};

module.exports = { initializePayment, verifyPayment };