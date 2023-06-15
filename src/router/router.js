const { notFound, errorHandler } = require("../middleware/errorHandler");
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const blogRouter = require("./blogRouter");
const categoryRouter = require("./product_categoryRouter");
const blogCategoryRouter = require("./blog_categoryRouter");
const brandRouter = require("./brandRouter");
const cookirParser = require("cookie-parser");
const morgan = require("morgan"); // we got a timeing when we sned the request and method with tool (postman or browser).

const mainRouter = (app) => {
  app.use(cookirParser());
  app.use(morgan("dev"));

  app.use("/api/usr", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/products/category", categoryRouter);
  app.use("/api/blogs/category", blogCategoryRouter);
  app.use("/api/brand", brandRouter);

  //error(use last)
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = mainRouter;
