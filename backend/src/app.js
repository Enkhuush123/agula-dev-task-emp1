const path = require("path");
const express = require("express");
const cors = require("cors");

const customerRoutes = require("./routes/customerRoutes");
const policyRoutes = require("./routes/policyRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/customers", customerRoutes);
app.use("/api/policies", policyRoutes);

app.use(errorHandler);

module.exports = app;
