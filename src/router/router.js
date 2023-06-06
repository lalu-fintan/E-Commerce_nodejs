const { notFound, errorHandler } = require("../middleware/errorHandler");
const userRouter = require("./userRouter");
const mainRouter = (app) => {
  app.use("/api/usr", userRouter);

  //error(use last)
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = mainRouter;
