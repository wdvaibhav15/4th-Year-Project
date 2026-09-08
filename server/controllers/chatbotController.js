import SearchHistory from "../models/SearchHistory.js";
import Room from "../models/Room.js";
import Booking from "../models/booking.js";
import { extractHotelFilters } from "../services/chatbotService.js";

// Escape special regex characters
const escapeRegex = (value = "") => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Convert a value into a valid Date object
const parseDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

// Find rooms that are already booked between selected dates
const getUnavailableRoomIds = async (
  checkInDate,
  checkOutDate
) => {
  const checkIn = parseDate(checkInDate);
  const checkOut = parseDate(checkOutDate);

  if (!checkIn || !checkOut) {
    return [];
  }

  const conflictingBookings = await Booking.find({
    checkInDate: {
      $lt: checkOut,
    },
    checkOutDate: {
      $gt: checkIn,
    },
    status: {
      $ne: "cancelled",
    },
  })
    .select("room")
    .lean();

  return conflictingBookings
    .map((booking) => booking.room)
    .filter(Boolean);
};

const createRoomQuery = (filters) => {
  const query = {
    isAvailable: true,
  };

  // Price filter
  if (
    filters.minPrice !== null ||
    filters.maxPrice !== null
  ) {
    query.pricePerNight = {};

    if (filters.minPrice !== null) {
      query.pricePerNight.$gte =
        filters.minPrice;
    }

    if (filters.maxPrice !== null) {
      query.pricePerNight.$lte =
        filters.maxPrice;
    }
  }

  // Room type filter
  if (filters.roomType) {
    query.roomType = {
      $regex: `^${escapeRegex(filters.roomType)}$`,
      $options: "i",
    };
  }

  

  // Amenities filter
  if (
    Array.isArray(filters.amenities) &&
    filters.amenities.length > 0
  ) {
    query.amenities = {
      $all: filters.amenities.map(
        (amenity) =>
          new RegExp(
            `^${escapeRegex(amenity)}$`,
            "i"
          )
      ),
    };
  }

  return query;
};

const createSortObject = (sortBy) => {
  switch (sortBy) {
    case "price_low_to_high":
      return {
        pricePerNight: 1,
      };

    case "price_high_to_low":
      return {
        pricePerNight: -1,
      };

    case "newest_first":
      return {
        createdAt: -1,
      };

    case "best_match":
    default:
      return {
        pricePerNight: 1,
      };
  }
};

const calculateMatchScore = (
  room,
  filters
) => {
  let score = 0;

  // City score
  if (
    filters.city &&
    room.hotel?.city?.toLowerCase() ===
      filters.city.toLowerCase()
  ) {
    score += 40;
  }

  // Room type score
  if (
    filters.roomType &&
    room.roomType?.toLowerCase() ===
      filters.roomType.toLowerCase()
  ) {
    score += 25;
  }

  // Give cheaper rooms a better score
  if (
    filters.maxPrice !== null &&
    filters.maxPrice !== undefined &&
    room.pricePerNight <= filters.maxPrice
  ) {
    const savings =
      filters.maxPrice - room.pricePerNight;

    score += Math.min(20, savings / 10);
  }

  // Amenity score
  const matchedAmenities =
    filters.amenities?.filter(
      (requestedAmenity) =>
        room.amenities?.some(
          (roomAmenity) =>
            roomAmenity.toLowerCase() ===
            requestedAmenity.toLowerCase()
        )
    ).length || 0;

  score += matchedAmenities * 10;

  // Hotel rating score
  if (room.hotel?.rating) {
    score += room.hotel.rating * 2;
  }

  return Math.round(score);
};

export const searchHotelsWithChatbot = async (
  req,
  res
) => {
  try {
    const { message } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a hotel search request",
      });
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 500) {
      return res.status(400).json({
        success: false,
        message:
          "Message cannot exceed 500 characters",
      });
    }

    console.log(
      "Chatbot message:",
      trimmedMessage
    );

    // Convert user message into filters
    const filters =
      await extractHotelFilters(
        trimmedMessage
      );

    console.log(
      "Extracted filters:",
      filters
    );

    if (!filters) {
      throw new Error(
        "No filters were returned by the chatbot service"
      );
    }

    const normalizedFilters = {
      city: filters.city ?? null,
      minPrice: filters.minPrice ?? null,
      maxPrice: filters.maxPrice ?? null,
      roomType: filters.roomType ?? null,
      guests: filters.guests ?? null,

      amenities: Array.isArray(
        filters.amenities
      )
        ? filters.amenities
        : [],

      sortBy:
        filters.sortBy || "best_match",

      checkInDate:
        filters.checkInDate ?? null,

      checkOutDate:
        filters.checkOutDate ?? null,
    };

    // Validate price range
    if (
      normalizedFilters.minPrice !== null &&
      normalizedFilters.maxPrice !== null &&
      normalizedFilters.minPrice >
        normalizedFilters.maxPrice
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum price cannot be greater than maximum price",
        filters: normalizedFilters,
      });
    }

    // Require both dates
    if (
      (normalizedFilters.checkInDate &&
        !normalizedFilters.checkOutDate) ||
      (!normalizedFilters.checkInDate &&
        normalizedFilters.checkOutDate)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide both check-in and check-out dates",
        filters: normalizedFilters,
      });
    }

    const checkIn = parseDate(
      normalizedFilters.checkInDate
    );

    const checkOut = parseDate(
      normalizedFilters.checkOutDate
    );

    // Validate dates
    if (
      normalizedFilters.checkInDate &&
      normalizedFilters.checkOutDate &&
      (!checkIn || !checkOut)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide valid check-in and check-out dates",
        filters: normalizedFilters,
      });
    }

    if (
      checkIn &&
      checkOut &&
      checkIn >= checkOut
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Check-out date must be after the check-in date",
        filters: normalizedFilters,
      });
    }

    const roomQuery = createRoomQuery(
      normalizedFilters
    );

    // Find booked rooms and exclude them
    const unavailableRoomIds =
      await getUnavailableRoomIds(
        normalizedFilters.checkInDate,
        normalizedFilters.checkOutDate
      );

    if (unavailableRoomIds.length > 0) {
      roomQuery._id = {
        $nin: unavailableRoomIds,
      };
    }

    const sortObject = createSortObject(
      normalizedFilters.sortBy
    );

    const hotelMatch =
      normalizedFilters.city
        ? {
            city: {
              $regex: `^${escapeRegex(
                normalizedFilters.city.trim()
              )}$`,
              $options: "i",
            },
          }
        : {};

    console.log(
      "MongoDB room query:",
      JSON.stringify(roomQuery, null, 2)
    );

    const databaseRooms =
      await Room.find(roomQuery)
        .populate({
          path: "hotel",
          select:
            "name city address rating",
          match: hotelMatch,
        })
        .sort(sortObject)
        .limit(20)
        .lean();

    // Remove rooms whose populated hotel is null
    let matchingRooms =
      databaseRooms.filter(
        (room) => room.hotel
      );

    if (
      normalizedFilters.sortBy ===
      "best_match"
    ) {
      matchingRooms = matchingRooms
        .map((room) => ({
          ...room,
          matchScore:
            calculateMatchScore(
              room,
              normalizedFilters
            ),
        }))
        .sort(
          (first, second) =>
            second.matchScore -
            first.matchScore
        );
    }

    matchingRooms =
      matchingRooms.slice(0, 5);

      await SearchHistory.create({
          user: req.auth?.userId || null,
          originalMessage: message,
          filters: normalizedFilters,
          resultCount: matchingRooms.length,
        });

    if (matchingRooms.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No matching rooms were found. Try increasing your budget, changing your dates, or removing one facility.",
        filters: normalizedFilters,
        rooms: [],
      });
    }

    const rooms = matchingRooms.map(
      (room) => ({
        roomId: room._id,
        hotelId: room.hotel?._id,

        hotelName:
          room.hotel?.name ||
          "Unnamed Hotel",

        city:
          room.hotel?.city || "",

        address:
          room.hotel?.address || "",

        rating:
          room.hotel?.rating ?? 0,

        roomType:
          room.roomType,

        pricePerNight:
          room.pricePerNight,

        amenities:
          room.amenities ?? [],

        image:
          room.images?.[0] || "",

        // Temporary default until maxGuests
        // exists in your Room schema
        maxGuests:
          room.maxGuests ?? 2,

        matchScore:
          room.matchScore ?? 0,
      })
    );

    return res.status(200).json({
      success: true,

      message: `I found ${
        rooms.length
      } matching ${
        rooms.length === 1
          ? "room"
          : "rooms"
      } for you.`,

      filters: normalizedFilters,
      rooms,
    });
  } catch (error) {
    console.error(
      "========== CHATBOT ERROR =========="
    );
    console.error(
      "Message:",
      error.message
    );
    console.error(
      "Status:",
      error.status
    );
    console.error(
      "Code:",
      error.code
    );
    console.error(
      "Full error:",
      error
    );
    console.error(
      "==================================="
    );

    return res
      .status(error.status || 500)
      .json({
        success: false,
        message:
          "The hotel assistant could not process your request",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,

        code:
          error.code || null,
      });
  }
};