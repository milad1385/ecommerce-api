module.exports = (role) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user.roles.includes(role)) {
        return res
          .status(403)
          .json({ message: "This route is forbidden for you !!!" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
