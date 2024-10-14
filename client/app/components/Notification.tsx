import React from "react";

const Notification = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  console.log("Notification Component Loaded"); // Debug log

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-black dark:text-white">
          Notifications
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="bg-black dark:bg-white text-white dark:text-black py-1 px-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors duration-300 text-base font-bold">
             Close
        </button>
      </div>

      <ul className="space-y-3">
        <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-black dark:text-white shadow-sm">
          Notification 1
        </li>
        <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-black dark:text-white shadow-sm">
          Notification 2
        </li>
        <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-black dark:text-white shadow-sm">
          Notification 3
        </li>
      </ul>
    </div>
  );
};

export default Notification;
