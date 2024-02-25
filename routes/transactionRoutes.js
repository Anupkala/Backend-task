import { Router } from "express";
const router = Router();
import {
  getAllTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData,
  getCombinedData,
} from "../controllers/transactionController.js";

router.get("/transactions", getAllTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChartData);
router.get("/pie-chart", getPieChartData);
router.get("/combined-data", getCombinedData);

export default router;
