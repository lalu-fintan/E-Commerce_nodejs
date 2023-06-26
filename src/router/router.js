const { notFound, errorHandler } = require("../middleware/errorHandler");
const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const blogRouter = require("./blogRouter");
const categoryRouter = require("./product_categoryRouter");
const blogCategoryRouter = require("./blog_categoryRouter");
const brandRouter = require("./brandRouter");
const couponRouter = require("./couponRouter");
const colorRouter = require("./colorRouter");
const enquiryRouter = require("./enqRouter");
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
  app.use("/api/color", colorRouter);
  app.use("/api/enquiry", enquiryRouter);
  app.use("/api/coupon", couponRouter);

  //error(use last)
  app.use(notFound);
  app.use(errorHandler);
};

module.exports = mainRouter;
