const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const forgetPasswordRoute = require("./forgetPasswordRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/forgetPassword", forgetPasswordRoute);
};

module.exports = mountRoutes;
