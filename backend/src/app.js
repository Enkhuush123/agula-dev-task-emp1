const express = require("express");
const cors = require("cors");

const customerRoutes = require("./routes/customerRoutes");
const policyRoutes = require("./routes/policyRoutes");
const errorHanlder = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/customers", customerRoutes);
app.use("/api/policies", policyRoutes);

app.use(errorHanlder);

module.exports = app;
