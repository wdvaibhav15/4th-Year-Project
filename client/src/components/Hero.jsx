import { assets } from "../assets/assets";
import { cities } from "../assets/assets";
import { useState } from "react";
import { useAppContext } from "../context/AppContext";

const Hero = () => {

  const {navigate, getToken, axios, setSearchedCities} = useAppContext();

  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const onSearch = async (e)=>{
      e.preventDefault();
      navigate(`/rooms?destination=${destination}`);
      // call api to save recent searched city data
      await axios.post(
  `/api/user/store-recent-search`,
  { recentSearchedCity: destination },
  { headers: { Authorization: `Bearer ${await getToken()}` } }
);
      // add destinatio  to searchedcities max 3 recent searched cities
      setSearchedCities((prevSearchedCities) => {
        const updatedSearchedCities = [...prevSearchedCities, destination];
        if(updatedSearchedCities.length > 3){
          updatedSearchedCities.shift();
        }
        return updatedSearchedCities;
      });
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/heroImage.jpg')] bg-no-repeat bg-cover bg-center h-screen">
      <div className="mt-12">
        <p className="bg-[#49B9ff]/50 px-3.5  py-1 rounded-full ">
        The Ultimate Hotel Experience{" "}
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-3xl mx-auto mt-4">
        Discover Your Perfect  <span className="text-[#49B9ff]">Destination</span>
      </h1>
      <p className="max-w-2xl mx-auto mt-3 text-sm md:text-base">
        Unparalleled luxury amd confort awaut at the world's mosr exclusive
        hotels and resorts. Start your journey today
      </p>
      </div>
      <form
  onSubmit={onSearch}
  className="bg-white mt-60 text-gray-500  rounded-lg px-6 py-4 w-full md:w-auto flex flex-col md:flex-row gap-4 mx-auto mb-[-120px] md:mb-0 "
>
  {/* Destination */}
  <div className="w-full  md:w-auto">
    <div className="flex items-center gap-2">
      <img src={assets.calenderIcon} alt="" className="h-4" />
      <label htmlFor="destinationInput">Destination</label>
    </div>

    <input
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      list="destinations"
      id="destinationInput"
      type="text"
      className="w-full md:w-auto rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
      placeholder="Type here"
      required
    />

    <datalist id="destinations">
      {cities.map((city, index) => (
        <option value={city} key={index} />
      ))}
    </datalist>
  </div>

  {/* Check In + Check Out row on mobile */}
  
  <div className="grid grid-cols-2 gap-3 w-full md:flex md:w-auto">
  <div className="min-w-0">
    <div className="flex items-center gap-2">
      <img src={assets.calenderIcon} alt="" className="h-4" />
      <label htmlFor="checkIn">Check in</label>
    </div>

    <input
      id="checkIn"
      type="date"
      className="w-full min-w-0 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
    />
  </div>

  <div className="min-w-0">
    <div className="flex items-center gap-2">
      <img src={assets.calenderIcon} alt="" className="h-4" />
      <label htmlFor="checkOut">Check out</label>
    </div>

    <input
      id="checkOut"
      type="date"
      className="w-full min-w-0 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
    />
  </div>
</div>

  {/* Guests + Search row on mobile */}
  <div className="flex gap-3 w-full md:w-auto items-end">
    <div className="flex-1 md:flex-none">
      <label htmlFor="guests">Guests</label>

      <input
        min={1}
        max={4}
        id="guests"
        type="number"
        className="w-full md:w-16 rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
        placeholder="0"
      />
    </div>

    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-md bg-black py-2 px-4 text-white cursor-pointer">
      <img src={assets.searchIcon} alt="" className="h-5" />
      <span>Search</span>
    </button>
  </div>
</form>
    </div>
  );
};

export default Hero;
