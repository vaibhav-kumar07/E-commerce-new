const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
require("dotenv").config();
const dbutils = require("./utils/Dbutils");
dbutils.initDB();
// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./utils/swagger.json");
// app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const auth_routes = require("./routes/authRoutes");
const product_routes = require("./routes/productRoutes");
const cart_routes = require("./routes/cartRoutes");
const order_routes = require("./routes/orderRoutes");
const PORT = process.env.PORT || 3001;

app.get("/", () => {
  console.log("hello world");
});

app.use(cors());
app.use("/auth", auth_routes);
app.use("/product", product_routes);
app.use("/user", cart_routes);
app.use("/user", order_routes);

process.on("SIGINT", () => {
  console.log("Closing server");
  dbutils.disconnectDB();
  process.exit();
});

process.on("exit", () => {
  console.log("Server closed");
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
