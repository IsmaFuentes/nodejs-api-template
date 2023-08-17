module.exports.catchAsync = (func) => {
  return (req, res) => {
    func(req, res).catch((err) => {
      res.status(400).json({
        status: "ERROR",
        message: err.message,
      });
    });
  };
};
