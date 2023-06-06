const { notFound, errorHandler } = require("../middleware/errorHandler");
const userRouter = require("./userRouter");
const cookirParser = require("cookie-parser");
const mainRouter = (app) => {
  app.use(cookirParser());
  app.use("/api/usr", userRouter);

  //error(use last)
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = mainRouter;
