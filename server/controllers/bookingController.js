import Booking from "../models/booking.js"
import Room from "../models/Room.js"
import Hotel from "../models/Hotel.js"
import transporter from "../configs/nodemailer.js"
import stripe from "stripe"

// function to check availability of rooms
const checkAvailability = async({checkInDate, checkOutDate, room}) =>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate : { $lte : checkOutDate },
            checkOutDate : { $gte : checkInDate }
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.log(error.message); 
    }
}

// APi to check availability of rooms
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, room} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success : true , isAvailable});
    } catch (error) {
        res.json({success : false , message : error.message});
    }
}

// API to create a new booking
//POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, room, guests} = req.body;
        const user = req.user._id.toString();
        // before booking check availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        if(!isAvailable){
            return res.json({success : false , message : "Room is not available"});
        }
        // get totalPrice from room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;
        // calculate totalPrice based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice = totalPrice * nights;

        const booking = await Booking.create({
            checkInDate, 
            checkOutDate, 
            room, 
            guests: +guests, 
            hotel: roomData.hotel._id,
            user, 
            totalPrice
        });

        // sending email to user on successfully booking
         const mailOptions ={
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: "Hotel Booking Details",
            html:`
            <h2>Your Booking Details</h2>
            <p>Dear ${req.user.username},</p>
            <p>Thank you for booking with us. Here are your booking details:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${booking._id}</li>
                <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
            </ul>
            <p> We look forward to welcoming you to our hotel.</p>
            <p> If you need to make any changes, feel free to contact us.</p>
            <p> Thank you for choosing our hotel for your stay.</p>
            <p> Best regards,</p>
            <p> Hotel Booking Team</p>
            `
         }

         await transporter.sendMail(mailOptions);

        res.json({success : true , message : "Booking created successfully"});
    } catch (error) {
        console.log(error.message);
        res.json({success : false , message : "Failed to create booking"});
    }
};
    //  API to get all bookings for a user
    // GET   /api/bookings/user
    
    export const getUserBookings = async (req, res) => {
  try {
    const user = req.userId; // Clerk userId

    const bookings = await Booking.find({ user })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.log("Get User Bookings Error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// 
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId}).populate("bookings");
    if(!hotel){
        return res.json({success : false , message : "Hotel not found"});
    }
        const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt:-1});
        //Total Bookings
        const totalBookings = bookings.length;
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        res.json({success : true , dashboardData : {bookings, totalBookings, totalRevenue}});
    } catch (error) {
        res.json({success : false , message : "Failed to fetch bookings"});
    }
    
}

export const stripePayment = async(req, res) => {
    try {
        const {bookingId} = req.body;
        const booking = await Booking.findById(bookingId);
        const roomData = await Room.findById(booking.room).populate("hotel");
        const totalPrice = booking.totalPrice;
        const {origin} = req.headers;

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const line_items = [
            {
            price_data:{
                currency: "usd",
                product_data: {
                   name: roomData.hotel.name, 
                },
                unit_amount: totalPrice * 100
            },
            quantity:1,

        }
    ]
    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode:"payment",
        success_url:`${origin}/loader/my-bookings`,
        cancel_url:`${origin}/my-bookings`,
        metadata: {
            bookingId,
        },
    })
    res.json({success : true , url: session.url});
    } catch (error) {
        res.json({success : false , message : "Payment Failed"});
    }
}
