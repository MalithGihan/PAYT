import React, { useState } from "react";
import Complaints from "../User/ComplaintsUser"; 
import RequestsComponent from "../User/RequestUser"; // Updated import
import Viewreport from "./Viewreport";

const Activities: React.FC<{ userId: string }> = ({ userId }) => { // Accept userId as a prop
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
         <input
          type="button"
          className={`text-center font-bold rounded-[8px] mt-4 mb-5 cursor-pointer py-2 px-4 drop-shadow-2xl ${
            activeComponent === "Report"
              ? "bg-green-300 text-white" 
              : "bg-white text-black dark:bg-white dark:text-[#000]"  
          }`}
          value="Report"
          onClick={() => setActiveComponent("Report")}
        />
      </div>

      <div>
        {activeComponent === "Complaints" && <Complaints />}
        {activeComponent === "Requests" && <RequestsComponent userId={userId} />} {/* Pass userId prop */}
        {activeComponent === "Report" && <Viewreport userId={userId} />}
      </div>
    </div>
  );
};

export default Activities;
