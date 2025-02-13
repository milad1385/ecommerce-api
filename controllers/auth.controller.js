exports.send = async (req, res, next) => {
  try {
    const { phone } = req.body;
  } catch (error) {
    next(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {};
