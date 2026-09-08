import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const About = () => {
  return (
    <div className="pt-28">
      {/* Hero */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32">
        <Title
          title="About StayTonight"
          subTitle="Discover comfort, experience luxury, and book your perfect stay with confidence."
          align="center"
        />
      </div>

      {/* About Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
        <img
          src={assets.heroImage}
          alt="Hotel Room"
          className="w-full md:w-1/2 rounded-2xl shadow-lg object-cover max-h-[420px]"
        />

        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold text-gray-800">
            Your Perfect Stay Starts Here
          </h2>

          <p className="text-gray-600 mt-4 leading-7">
            At StayTonight, we make hotel booking simple, secure, and
            stress-free. Whether you're planning a family vacation, business
            trip, weekend escape, or luxury getaway, we help you find the right
            stay at the right price.
          </p>

          <p className="text-gray-600 mt-4 leading-7">
            Our platform connects travelers with trusted hotels, verified rooms,
            secure payments, and instant booking confirmation.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-gray-700">
            <p>✓ Easy Booking</p>
            <p>✓ Secure Payment</p>
            <p>✓ Verified Hotels</p>
            <p>✓ Best Prices</p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24">
        <Title
          title="Why Choose Us"
          subTitle="We provide everything you need for a smooth and memorable hotel booking experience."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            ["🏨", "Wide Hotel Selection", "Choose from budget hotels, premium rooms, and luxury stays."],
            ["💳", "Secure Payments", "Book safely with protected online payment options."],
            ["⚡", "Instant Booking", "Confirm your room quickly with just a few clicks."],
            ["⭐", "Verified Hotels", "Stay confidently with trusted and verified hotel partners."],
            ["🎧", "24/7 Support", "Get help whenever you need it during your journey."],
            ["💰", "Best Price Offers", "Enjoy special deals, discounts, and seasonal offers."],
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl">{item[0]}</div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">
                {item[1]}
              </h3>
              <p className="text-gray-500 mt-2 leading-6">{item[2]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Vision */}
      <div className="bg-gray-50 px-6 md:px-16 lg:px-24 xl:px-32 py-20 mt-24">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-playfair font-semibold text-gray-800">
              Our Mission
            </h2>
            <p className="text-gray-600 mt-4 leading-7">
              Our mission is to make travel easier by helping users discover,
              compare, and book hotels that match their comfort, budget, and
              travel style.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-playfair font-semibold text-gray-800">
              Our Vision
            </h2>
            <p className="text-gray-600 mt-4 leading-7">
              Our vision is to become a trusted hotel booking platform where
              every traveler can book confidently and enjoy a memorable stay.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["50+", "Hotels"],
            ["5K+", "Happy Guests"],
            ["10+", "Cities"],
            ["4.8★", "Average Rating"],
          ].map((stat, index) => (
            <div key={index}>
              <h3 className="text-4xl font-bold text-blue-600">{stat[0]}</h3>
              <p className="text-gray-600 mt-2">{stat[1]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 px-6 md:px-16 lg:px-24 xl:px-32 py-20">
        <Title
          title="How It Works"
          subTitle="Book your perfect stay in four simple steps."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {[
            ["1", "Search", "Find hotels by city or destination."],
            ["2", "Select", "Choose your favorite room."],
            ["3", "Book", "Confirm your stay securely."],
            ["4", "Enjoy", "Check in and relax."],
          ].map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                {step[0]}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-4">
                {step[1]}
              </h3>
              <p className="text-gray-500 mt-2">{step[2]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-20">
        <div className="bg-blue-200 rounded-3xl text-center text-black py-14 px-6">
          <h2 className="text-3xl md:text-4xl font-playfair font-semibold">
            Ready for Your Next Adventure?
          </h2>
          <p className="mt-4 text-black">
            Find the perfect hotel and book your stay with StayTonight today.
          </p>

          <button
          to="/rooms"

            onClick={() => (window.location.href = "/rooms")}
            className="mt-8 bg-primary text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition cursor-pointer"
          >
            Explore Hotels
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;