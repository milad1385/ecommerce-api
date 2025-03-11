const { createPayment } = require("../services/zarinpal");

exports.createCheckout = async (req, res, next) => {
  try {
    const result = await createPayment({
      amountInRial: 1000,
      description: "توضیحات تستی برای تست پرداخت",
      mobile: "09336085012",
    });

    console.log(result);
    
  } catch (error) {
    next(error);
  }
};

exports.verifyCheckout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
