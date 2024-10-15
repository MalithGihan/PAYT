import React from "react";
import ListtoCollect from "./ListtoCollect";

const RequestRoutes = () => {
  return (
    <div className="p-5 bg-green-100 dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-green-600 dark:text-white">List of routes</h2>
      <p className="text-gray-700 dark:text-gray-300">
        Here you can view allocated routes.
      </p>
      <ListtoCollect/>
    </div>
  );
};

export default RequestRoutes;
