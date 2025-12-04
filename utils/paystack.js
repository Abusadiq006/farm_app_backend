const axios=require('axios')

exports.initializePayment=async(data) => {
    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            data,
            {headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}}
        )
        return response=data
    }catch(err) {
        return {error:err.response?.data||err.message}
    }
}

exports.verifyPayment=async(reference)=>{
    try {
        const response=await axios.get (
            `https://api.paystack.co/transaction/verify/${reference}`,
            {headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}}
        )
        return response.data
    }catch(err){
        return {error:err.response?.data||err.message}
    }
}