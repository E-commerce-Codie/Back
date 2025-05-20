// Import required libraries
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const { body } = require("express-validator");

// Load environment variables
dotenv.config({ path: "config.env" });

// Import files
const dbConnection = require("./config/dataBase");
const mountRoutes = require("./routes");
const globalError = require("./middleWares/errorMiddleware");
const ApiError = require("./utils/apiError");
const controller = require("./controller/orderController");
// Application setup
const app = express();
app.set("trust proxy", 1);

//WebHook
app.post(
  "/webhook/paymob",
  express.json({ type: "application/json" }),
  controller.webhookCheckout
);

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "50kb" }));

// Security Middlewares
// app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again after 15 minutes.",
});
app.use("/api", limiter);

// Connect to MongoDB
dbConnection();

// Logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Validation example middleware (if needed globally)
app.use([body("*").trim().escape()]);

// Mount Routes
mountRoutes(app);

// Handle unmatched routes
app.use((req, res, next) => {
  next(new ApiError(`Can not find this route: ${req.originalUrl}`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

// Server setup
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.stack}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
