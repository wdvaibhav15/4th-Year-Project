
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook hit");

    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return res.status(500).json({
        success: false,
        message: "CLERK_WEBHOOK_SECRET is missing",
      });
    }

    const whook = new Webhook(WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString();
    const event = whook.verify(payload, headers);

    const { data, type } = event;

    if (type === "user.created" || type === "user.updated") {
      const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        username:
          `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
          data.username ||
          "User",
        image: data.image_url || "",
      };

      await User.findByIdAndUpdate(data.id, userData, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    return res.status(200).json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default clerkWebhooks;