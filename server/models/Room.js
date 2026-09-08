
// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema(
//   {
//     hotel: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Hotel",
//       required: true,
//     },

//     roomType: {
//       type: String,
//       required: true,
//     },

//     pricePerNight: {
//       type: Number,
//       required: true,
//     },

//     amenities: [
//       {
//         type: String,
//       },
//     ],

//     images: [
//       {
//         type: String,
//       },
//     ],

//     isAvailable: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );

// const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

// export default Room;
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    roomType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Single Bed",
        "Double Bed",
        "Luxury Room",
        "Family Suite",
      ],
    },

    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
      default: 2,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room =
  mongoose.models.Room ||
  mongoose.model("Room", roomSchema);

export default Room;