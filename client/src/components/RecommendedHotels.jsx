import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  
  useEffect(() => {
  if (!rooms || rooms.length === 0) return;

  // Agar user ne abhi tak search nahi kiya hai
  if (!searchedCities || searchedCities.length === 0) {
    setRecommended(rooms.slice(0, 4));
    return;
  }

  // Search ki hui cities ke hisaab se filter karo
  const filteredHotels = rooms.filter((room) =>
    searchedCities.includes(room.hotel.city)
  );

  // Agar match mil gaya to wahi dikhao, warna default 4 rooms dikhao
  setRecommended(
    filteredHotels.length > 0 ? filteredHotels : rooms.slice(0, 4)
  );
}, [rooms, searchedCities]);

  if (recommended.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Recommended Hotels"
        subTitle="Stay at our top-rated hotels, chosen for their outstanding service, luxurious comfort, and exceptional guest experiences."
        align="center"
        font="font-playfair"
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedHotels;