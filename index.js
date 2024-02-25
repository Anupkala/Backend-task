import express, { json } from "express";
import transactionRoutes from "./routes/transactionRoutes.js";

const app = express();

app.use(json());
app.use("/api", transactionRoutes);

const PORT = process.env.PORT || 6969;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
