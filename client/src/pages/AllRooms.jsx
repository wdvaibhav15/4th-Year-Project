import React, { useState } from "react";
import { facilityIcons, roomsDummyData } from "../assets/assets";
import { useNavigate, useSearchParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { assets } from "../assets/assets";
import { useSession } from "@clerk/clerk-react";
import { useAppContext } from "../context/AppContext";
import { useMemo } from "react";

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="cursor-pointer"
      />
      <span className="font-light select-none"> {label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
        className="cursor-pointer"
      />
      <span className="font-light select-none"> {label}</span>
    </label>
  );
};

const AllRooms = () => {

  const [searchPasams, setSearchParams] = useSearchParams();
  const {rooms, navigate, currency} = useAppContext();
  
  // Using the state variable to toggle filters visibility
  const [openFilters, setOpenFilters] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes:[],
    priceRanges: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = [
    "Single Bed", 
    "Double Bed", 
    "Luxury Room", 
    "Family Suite"
  ];

  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price Low to High", 
    "Price High to Low", 
    "Newest First"
  ];

  const handleFilterChange =(checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = {...prevFilters};
      if(checked){
        updatedFilters[type].push(value);
      }else{
        updatedFilters[type] = updatedFilters[type].filter((item) => item !== value);
      }
      return updatedFilters;
    })
  }

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  }

  // function to check if a room matches the selected room types
  const matchesRoomTypes = (room) => {
    return selectedFilters.roomTypes.length === 0 || selectedFilters.roomTypes.includes(room.roomType);
  }

  //function to check if a room matches the selected price ranges
  const matchesPriceRanges = (room) => {
    return selectedFilters.priceRanges.length === 0 || selectedFilters.priceRanges.some((range) => {
      const [min, max] = range.split(" to ").map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    })
  }

  // function to sort based on selected sort option
  const sortRooms = (a, b) => {
    if(selectedSort === "Price Low to High"){
      return a.pricePerNight - b.pricePerNight;
    }
    if(selectedSort === "Price High to Low"){
      return b.pricePerNight - a.pricePerNight;
    }
    if(selectedSort === "Newest First"){
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  }

  // Filter Destinations
  const filteredDestination = (room) =>{
    const destination = searchPasams.get("destination");
    if(!destination){
      return true;
    }
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  }

  // Filter and sort rooms based on the selected filters and sort option
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => matchesRoomTypes(room) && matchesPriceRanges(room) && filteredDestination(room)).sort(sortRooms);
  },[rooms, selectedFilters, selectedSort, searchPasams]);

  // cleared all filters
  const clearFilters = () => {
    setSelectedFilters({
      roomTypes: [],
      priceRanges: [],
    });
    setSelectedSort("");
    setSearchParams({});
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 gap-8">
      
      {/* Rooms Listing Section */}
      <div className="w-full lg:flex-1">
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title="View Rooms Details"
              className="w-full max-w-[380px] h-[260px] rounded-xl shadow-lg object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center">
                <StarRating rating={4} />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
              </div>
              <div className=" flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-xl font-medium text-gray-700">
                ${room.pricePerNight} per night
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Sidebar Wrapper */}
      <div className="w-full lg:w-72 lg:sticky lg:top-24 flex flex-col gap-3">
        
        {/* Toggle Button: Shows only on mobile/tablet (lg:hidden) */}
        <button 
          onClick={() => setOpenFilters(!openFilters)}
          className="lg:hidden w-full py-2.5 px-4 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium flex justify-between items-center transition-all active:scale-[0.98]"
        >
          <span>Filters</span>
          <span className="text-xs text-gray-500">
            {openFilters ? "Hide ▲" : "Show ▼"}
          </span>
        </button>

        {/* Main Filter Container */}
        {/* Uses conditional styling to hide/show on mobile, but stays visible ('lg:block') on desktop */}
        <div className={`${openFilters ? "block" : "hidden"} lg:block w-full border border-gray-300 text-gray-700 bg-white rounded-lg shadow-sm transition-all`}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
            <h2 className="font-semibold uppercase text-gray-800 tracking-wider text-sm">Filters</h2>
            <button
    onClick={clearFilters}
    className="text-xs uppercase text-gray-400 hover:text-black"
>
    Clear
</button>
          </div>

          <div className="px-4 py-5">
            {/* Popular Filters */}
            <div>
              <h3 className="font-medium text-gray-800 mb-2">
                Popular filters
              </h3>
              <div className="flex flex-col">
                {roomTypes.map((room, index) => (
                  <CheckBox key={index} label={room} selected={selectedFilters.roomTypes.includes(room)} onChange={(checked)=> handleFilterChange(checked, room, "roomTypes")}/>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-2">Price Range</h3>
              <div className="flex flex-col">
                {priceRanges.map((range, index) => (
                  <CheckBox key={index} label={`${currency} ${range}`} selected={selectedFilters.priceRanges.includes(range)} onChange={(checked)=> handleFilterChange(checked, range, "priceRanges")} />
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-800 mb-2">Sort By</h3>
              <div className="flex flex-col">
                {sortOptions.map((option, index) => (
                  <RadioButton key={index} label={option} selected={selectedSort === option} onChange={() => handleSortChange(option)}/>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default AllRooms;