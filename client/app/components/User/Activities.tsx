import React, { useState } from "react";
import Complaints from "../User/ComplaintsUser"; 
import Requests from "../User/RequestUser"; 

const Activities = () => {
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
          value="Complaints"
          onClick={() => setActiveComponent("Complaints")}
        />
        <input
          type="button"
          className={`text-center font-bold rounded-[8px] mt-4 mb-5 cursor-pointer py-2 px-4 drop-shadow-2xl ${
            activeComponent === "Requests"
              ? "bg-green-300 text-white" 
              : "bg-white text-black dark:bg-white dark:text-[#000]"  
          }`}
          value="Requests"
          onClick={() => setActiveComponent("Requests")}
        />
      </div>

      <div>
        {activeComponent === "Complaints" && <Complaints />}
        {activeComponent === "Requests" && <Requests />}

      </div>
    </div>
  );
};

export default Activities;
