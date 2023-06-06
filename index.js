const exrpess = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./src/config/db_config");
const mainRouter = require("./src/router/router");

const app = exrpess();
app.use(exrpess.json());

mainRouter(app);

connectDb();

port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server connected on port ${port}`);
});
