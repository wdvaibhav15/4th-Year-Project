const ROOM_TYPES = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];

const AMENITIES = [
  "Free WiFi",
  "Free Breakfast",
  "Room Service",
  "Pool Access",
  "Mountain View",
];

const CITY_NAMES = [
  "Lucknow",
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Varanasi",
  "Noida",
  "Gurugram",
];

const findPrice = (message, patterns) => {
  for (const pattern of patterns) {
    const match = message.match(pattern);

    if (match?.[1]) {
      return Number(match[1].replace(/,/g, ""));
    }
  }

  return null;
};

const detectCity = (message) => {
  const lowerMessage = message.toLowerCase();

  const knownCity = CITY_NAMES.find((city) =>
    lowerMessage.includes(city.toLowerCase()),
  );

  if (knownCity) {
    return knownCity;
  }

  // Finds location after words such as "in Lucknow"
  const cityMatch = message.match(
    /\b(?:in|at|near)\s+([a-zA-Z\s]+?)(?=\s+(?:under|below|above|over|with|for|having|between)\b|$)/i,
  );

  return cityMatch?.[1]?.trim() || null;
};

const detectRoomType = (message) => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("single bed") ||
    lowerMessage.includes("single room")
  ) {
    return "Single Bed";
  }

  if (
    lowerMessage.includes("double bed") ||
    lowerMessage.includes("double room")
  ) {
    return "Double Bed";
  }

  if (lowerMessage.includes("luxury room") || lowerMessage.includes("luxury")) {
    return "Luxury Room";
  }

  if (
    lowerMessage.includes("family suite") ||
    lowerMessage.includes("family room")
  ) {
    return "Family Suite";
  }

  return null;
};

const detectAmenities = (message) => {
  const lowerMessage = message.toLowerCase();
  const amenities = [];

  if (
    lowerMessage.includes("wifi") ||
    lowerMessage.includes("wi-fi") ||
    lowerMessage.includes("internet")
  ) {
    amenities.push("Free WiFi");
  }

  if (
    lowerMessage.includes("breakfast") ||
    lowerMessage.includes("morning meal")
  ) {
    amenities.push("Free Breakfast");
  }

  if (lowerMessage.includes("room service")) {
    amenities.push("Room Service");
  }

  if (lowerMessage.includes("pool") || lowerMessage.includes("swimming")) {
    amenities.push("Pool Access");
  }

  if (
    lowerMessage.includes("mountain view") ||
    lowerMessage.includes("mountain")
  ) {
    amenities.push("Mountain View");
  }

  return amenities;
};

const detectGuests = (message) => {
  const patterns = [
    /\bfor\s+(\d+)\s+(?:guests?|people|persons?|adults?)\b/i,
    /\b(\d+)\s+(?:guests?|people|persons?|adults?)\b/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
};

const detectSort = (message) => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("cheapest") ||
    lowerMessage.includes("low to high") ||
    lowerMessage.includes("lowest price") ||
    lowerMessage.includes("budget")
  ) {
    return "price_low_to_high";
  }

  if (
    lowerMessage.includes("most expensive") ||
    lowerMessage.includes("high to low") ||
    lowerMessage.includes("highest price")
  ) {
    return "price_high_to_low";
  }

  if (
    lowerMessage.includes("newest") ||
    lowerMessage.includes("latest") ||
    lowerMessage.includes("recently added")
  ) {
    return "newest_first";
  }

  return "best_match";
};

export const extractHotelFilters = async (message) => {
  if (!message || typeof message !== "string") {
    throw new Error("A valid hotel-search message is required");
  }

  const cleanMessage = message.trim();

  if (!cleanMessage) {
    throw new Error("Hotel-search message cannot be empty");
  }

  const maxPrice = findPrice(cleanMessage, [
    /\b(?:under|below|less than|maximum|max|up to|within)\s*(?:₹|\$|rs\.?|inr)?\s*([\d,]+)/i,
    /\b(?:₹|\$|rs\.?|inr)\s*([\d,]+)\s*(?:or less|maximum|max)?/i,
  ]);

  const minPrice = findPrice(cleanMessage, [
    /\b(?:above|over|more than|minimum|min|starting from)\s*(?:₹|\$|rs\.?|inr)?\s*([\d,]+)/i,
  ]);

  const betweenMatch = cleanMessage.match(
    /\bbetween\s*(?:₹|\$|rs\.?|inr)?\s*([\d,]+)\s*(?:and|to|-)\s*(?:₹|\$|rs\.?|inr)?\s*([\d,]+)/i,
  );

  let finalMinPrice = minPrice;
  let finalMaxPrice = maxPrice;

  if (betweenMatch) {
    finalMinPrice = Number(betweenMatch[1].replace(/,/g, ""));

    finalMaxPrice = Number(betweenMatch[2].replace(/,/g, ""));
  }

  return {
    city: detectCity(cleanMessage),
    minPrice: finalMinPrice,
    maxPrice: finalMaxPrice,
    roomType: detectRoomType(cleanMessage),
    guests: detectGuests(cleanMessage),
    amenities: detectAmenities(cleanMessage),
    sortBy: detectSort(cleanMessage),
  };
};
