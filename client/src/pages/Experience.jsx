import React from "react";

const experiences = [
  {
    icon: "🏖️",
    title: "Pool Escapes",
    description:
      "Relax by crystal-clear waters and enjoy unforgettable seaside vacations.",
  },
  {
    icon: "🏔️",
    title: "Mountain Retreats",
    description:
      "Reconnect with nature through peaceful stays surrounded by breathtaking mountains.",
  },
  {
    icon: "🏙️",
    title: "City Adventures",
    description:
      "Explore vibrant cities with hotels located near popular attractions and landmarks.",
  },
  {
    icon: "💆",
    title: "Luxury Spa",
    description:
      "Unwind with premium spa treatments and wellness experiences during your stay.",
  },
  {
    icon: "🍽️",
    title: "Fine Dining",
    description:
      "Enjoy world-class restaurants offering delicious local and international cuisine.",
  },
  {
    icon: "🎉",
    title: "Special Events",
    description:
      "Celebrate weddings, birthdays, conferences, and memorable occasions in style.",
  },
];

const Experience = () => {
  return (
    <div className={`py-24 px-6 md:px-16 lg:px-24 xl:px-32 `}>
      {/* Heading */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="text-blue-600 w-auto bg-blue-200 rounded-3xl  font-bold tracking-[4px] uppercase">
          <p>
          EXPERIENCES
        </p>
        </div>

        <h2 className="text-4xl md:text-5xl font-playfair font-semibold text-gray-800 mt-3">
          More Than Just a Stay
        </h2>

        <p className="text-gray-600 mt-5 leading-7 text-lg">
          Every journey is unique. Discover unforgettable experiences that make
          every trip memorable—from relaxing beach vacations to exciting city
          adventures.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
        {experiences.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-3xl">
              {item.icon}
            </div>

            <h3 className="text-2xl font-playfair font-semibold text-gray-800 mt-6">
              {item.title}
            </h3>

            <p className="text-gray-600 mt-3 leading-7">{item.description}</p>

            <button className="mt-6 text-blue-600 font-medium hover:text-blue-700 transition">
              Learn More →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
