
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import "dotenv/config";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";

import clerkWebhooks from "./controllers/clerkWebhooks.js";

import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";


import {stripeWebhooks} from "./controllers/stripeWebhooks.js";
import chatbotRouter from "./routes/chatbotRoutes.js";

const app = express();

await connectDB();
connectCloudinary();

app.use(cors()); // Enable Cross-origin resource sharing

// Api to listen to stripe webhooks
app.post("/api/stripe", express.raw({type:"application/json"}), stripeWebhooks);

// Clerk webhook MUST be before express.json()
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/chatbot", chatbotRouter);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;