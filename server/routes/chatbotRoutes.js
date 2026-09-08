import express from "express";
import { searchHotelsWithChatbot } from "../controllers/chatbotController.js";

const chatbotRouter = express.Router();

chatbotRouter.post( "/search",searchHotelsWithChatbot);

export default chatbotRouter;