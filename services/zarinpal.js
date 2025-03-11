const axios = require("axios");

const zarinpal = axios.create({
  baseURL: process.env.ZARINPAL_BASE_API_URL,
});

exports.createPayment = async ({ amountInRial, description, mobile }) => {
  try {
    const response = await zarinpal.post("/request.json", {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: amountInRial,
      callback_url: process.env.ZARINPAL_CALLBACK_URL,
      description,
      metadata: {
        mobile,
      },
    });

    const data = response.data.data;

    return {
      authority: data.authority,
      paymentUrl: `${process.env.ZARINPAL_BASE_PAYMENT_URL}/${data.authority}`,
    };
  } catch (error) {
    throw new Error(error);
  }
};

exports.verifyPayment = async ({ amountInRial, authority }) => {
  try {
    const response = await zarinpal.post("/verify.json", {
      merchant_id: process.env.ZARINPAL_MERCHANT_ID,
      amount: amountInRial,
      authority,
    });

    const data = response.data.data;

    return data;
  } catch (err) {
    throw new Error(err);
  }
};
