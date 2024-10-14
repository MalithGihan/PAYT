import React, { useState } from "react";
import BinSearch from "./BinSearch";
import RequestRoutes from "./RequestRoutes";

const Schedules = () => {
 
  const [activeComponent, setActiveComponent] = useState("Complaints");

  return (
    <div className="w-full min-h-screen pb-10">
      {/* Buttons to switch components */}
      <div className="flex flex-row gap-5 mb-8">
        <input
          type="button"
          className={`text-center font-bold rounded-[8px] mt-4 mb-5 cursor-pointer py-2 px-4 drop-shadow-2xl ${
            activeComponent === "Complaints"
              ? "bg-green-300 text-white" 
              : "bg-white text-black dark:bg-white dark:text-[#000]" 
          }`}
          value="Scan Bin"
          onClick={() => setActiveComponent("BinSearch")}
        />
        <input
          type="button"
          className={`text-center font-bold rounded-[8px] mt-4 mb-5 cursor-pointer py-2 px-4 drop-shadow-2xl ${
            activeComponent === "Requests"
              ? "bg-green-300 text-white" 
              : "bg-white text-black dark:bg-white dark:text-[#000]"  
          }`}
          value="Requested Routes"
          onClick={() => setActiveComponent("RequestRoutes")}
        />
      </div>

      <div>
        {activeComponent === "BinSearch" && <BinSearch />}
        {activeComponent === "RequestRoutes" && <RequestRoutes />}
      </div>
    </div>
  );
};

export default Schedules;
