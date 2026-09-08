import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const HotelCard = ({room , index}) => {
  return (
    <Link  to={'/rooms/' + room._id}
    onClick={()=> scrollTo(0,0)} key={room._id}
    className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]'>
        <img src={room.images[0]} alt="room" 
         />
       {index % 2 === 0 && <p className='px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full'>Best Seller</p>}
        <div className="pt-5 p-4]">
            <div className="flex items-center justify-between">
                <p className="ml-2 mr-2 font-playfair text-xl font-medium text-gray-800">{room.hotel.name}</p>
                <div className='flex items-center gap-1'>
                    <img src={assets.starIconFilled} alt="star-icon" />4.5
                </div>
            </div>
            <div className="flex ml-2 items-center gap-1 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
            </div>
            <div className="flex items-center justify-center gap-12 mt-4 mb-2 ">
                <p><span className="text-xl text-gray-800">${room.pricePerNight}</span> per night</p>
                <button className="px-4 py-2 text-sm font-medium norder border-gray-400 rounded rounded-xl hover:bg-gray-200 transition-all cursor-pointer">Book Now</button>
            </div>
        </div>
    </Link>
  )
}

export default HotelCard
