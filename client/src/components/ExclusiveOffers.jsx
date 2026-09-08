
import React from 'react'
import Title from './Title'
import { assets, exclusiveOffers } from '../assets/assets'

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-20">

      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Exclusive Offers"
          subTitle="Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories."
        />

        <button className="group flex items-center gap-2 font-medium cursor-pointer">
          View All Offers
          <img
            className="group-hover:translate-x-1 transition-all"
            src={assets.arrowIcon}
            alt="arrow-icon"
          />
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-10">
        {exclusiveOffers.map((item) => (
          <div
            key={item._id}
            className="group relative flex flex-col justify-between min-h-[300px] p-6 rounded-xl text-white bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image})` }}
          >
            <p className="absolute top-4 left-4 px-3 py-1 text-xs bg-white text-gray-800 font-medium rounded-full">
              {item.priceOff}% OFF
            </p>

            <div className="mt-12">
              <h3 className="text-2xl font-medium font-playfair">
                {item.title}
              </h3>

              <p className="mt-2">
                {item.description}
              </p>

              <p className="text-xs text-white/70 mt-3">
                Expires on: {item.expiryDate}
              </p>
            </div>

            <button className="flex items-center gap-2 font-medium cursor-pointer mt-6">
              View Offers
              <img
                className="invert group-hover:translate-x-1 transition-all"
                src={assets.arrowIcon}
                alt="arrow-icon"
              />
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ExclusiveOffers