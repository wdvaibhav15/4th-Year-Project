import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/", protect, getDashboardData);

export default dashboardRouter;