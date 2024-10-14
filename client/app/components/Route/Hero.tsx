import React, { FC, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Image from "next/image";

import image1 from "../../../asserts/images/woman-shopping-with-fabric-tote-bag.jpg";
import image2 from "../../../asserts/images/james-day-ECyvZuZeLGc-unsplash.jpg";
import image3 from "../../../asserts/images/pawel-czerwinski-RkIsyD_AVvc-unsplash.jpg";

type Props = {};

const contentData = [
  {
    image: image1,
    title: "Keep Your City Clean",
    description:
      "Join our garbage collection program to keep the environment clean and healthy.",
  },
  {
    image: image2,
    title: "Reduce Waste",
    description: "Learn how to recycle and reduce waste in your daily life.",
  },
  {
    image: image3,
    title: "Community Engagement",
    description:
      "Get involved with community clean-up events and make a difference.",
  },
];

const Hero: FC<Props> = () => {
  //const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % contentData.length);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="w-full h-screen bg-green-100 dark:bg-gray-800 flex flex-col items-center justify-center p-4 mt-[30vh] mb-[20vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-green-700 dark:text-white">
          Pay As You Throw
        </h1>
        <p className="my-4 text-xl text-gray-700 dark:text-gray-300 max-w-lg mx-auto">
          Efficient, eco-friendly, and reliable waste management for your
          community.
        </p>
      </div>

      <div className="relative w-full max-w-lg mt-10">
        <input
          type="search"
          placeholder="Search locations or services..."
          className="bg-white border dark:border-none dark:bg-gray-700 placeholder:text-gray-500 dark:placeholder:text-gray-300 rounded-lg p-4 h-[50px] w-full outline-none text-gray-700 dark:text-white text-lg pr-[50px]"
        />
        <div className="absolute right-0 top-0 flex items-center justify-center w-[50px] h-full bg-green-500 dark:bg-[#39c1f3] rounded-r-lg cursor-pointer">
          <BiSearch className="text-white" size={25} />
        </div>
      </div>

      {/*    
      <div className=" relative max-w-lg overflow-hidden rounded-lg shadow-lg mt-10">
        {contentData.map((content, index) => (
          <div
            key={index}
            className={`absolute w-full transition-transform duration-1000 ease-in-out transform ${
              index === currentIndex ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            <Image src={content.image} alt={content.title} className="w-full h-[400px] object-cover rounded-lg" />
            <div className="p-5 bg-white bg-opacity-80 rounded-b-lg">
              <h2 className="text-xl font-semibold">{content.title}</h2>
              <p className="text-gray-700">{content.description}</p>
            </div>
          </div>
        ))}
      </div> */}

      <div className="w-full py-16 bg-white dark:bg-gray-900 mt-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          How Our Garbage Collection System Works
        </h2>
        <div className="flex flex-wrap justify-center gap-10 max-w-5xl mx-auto">
          <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:w-[300px] text-center">
            <h3 className="text-2xl font-semibold text-green-600 dark:text-white mb-4">
              Scheduled Pickups
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Automated scheduling ensures timely waste collection in your area.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:w-[300px] text-center">
            <h3 className="text-2xl font-semibold text-green-600 dark:text-white mb-4">
              Smart Bins
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Smart sensors monitor bin levels and notify the collection team
              when they need emptying.
            </p>
          </div>
          <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:w-[300px] text-center">
            <h3 className="text-2xl font-semibold text-green-600 dark:text-white mb-4">
              Eco-Friendly Disposal
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Waste is sorted and processed for recycling and eco-friendly
              disposal.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full py-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
          Get Involved
        </h2>
        <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Join our initiative to keep your community clean and sustainable.
          Contact us to learn more about how you can contribute to efficient
          waste management.
        </p>
        <div className="text-center">
          <button className="bg-green-600 dark:bg-[#39c1f3] text-white px-6 py-3 rounded-lg hover:bg-green-500 dark:hover:bg-blue-400 transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
