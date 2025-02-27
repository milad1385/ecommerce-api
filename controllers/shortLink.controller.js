const { errorResponse } = require("./../helpers/responses");
const Product = require("../models/product");

exports.redirectToProduct = async (req, res, next) => {
  try {
    const { shortIdentifier } = req.params;

    const product = await Product.findOne({ shortIdentifier });

    if (!product) {
      return errorResponse(res, 404, "Product not found !!");
    }

    return res.redirect(`/api/product/${product._id}`);
  } catch (err) {
    next(err);
  }
};
