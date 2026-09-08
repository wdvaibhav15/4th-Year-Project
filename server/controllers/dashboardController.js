
import Hotel from "../models/Hotel.js";
import Booking from "../models/booking.js";
import User from "../models/User.js";

export const getDashboardData = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      $or: [{ owner: req.userId }, { owner: req.user?._id }],
    });

    if (!hotel) {
      return res.json({ success: false, message: "Hotel not found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room")
      .sort({ createdAt: -1 });

    const bookingsWithUser = await Promise.all(
      bookings.map(async (booking) => {
        const userData = await User.findById(booking.user);

        return {
          ...booking.toObject(),
          user: {
            username: userData?.username || "User",
          },
        };
      })
    );

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce((acc, booking) => {
      return acc + Number(booking.totalPrice || 0);
    }, 0);

    res.json({
      success: true,
      dashboardData: {
        bookings: bookingsWithUser,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};