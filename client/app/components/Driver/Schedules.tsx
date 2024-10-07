import React, { useState } from "react";

// Define a Schedule type
interface Schedule {
  date: string;
  time: string;
  route: string;
}

const Schedules = () => {
  // Initialize state with the Schedule type
  const [schedule, setSchedule] = useState<Schedule>({ date: "", time: "", route: "" });
  const [schedules, setSchedules] = useState<Schedule[]>([]); // Array of Schedule

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchedule({ ...schedule, [name]: value });
  };

  const addSchedule = () => {
    setSchedules([...schedules, schedule]);
    setSchedule({ date: "", time: "", route: "" });
  };

  return (
    <div className="w-full p-6">
      <h2 className="text-2xl font-bold mb-4">Driver Schedule Management</h2>

      <div className="mb-6">
        <h3 className="text-xl mb-2">Add New Schedule</h3>
        <div className="flex flex-col gap-4">
          <input
            type="date"
            name="date"
            value={schedule.date}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Select Date"
          />
          <input
            type="time"
            name="time"
            value={schedule.time}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Select Time"
          />
          <input
            type="text"
            name="route"
            value={schedule.route}
            onChange={handleInputChange}
            className="border p-2 rounded"
            placeholder="Enter Route"
          />
          <button
            onClick={addSchedule}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add Schedule
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl mb-2">Current Schedules</h3>
        {schedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Route</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((sch, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{sch.date}</td>
                  <td className="border px-4 py-2">{sch.time}</td>
                  <td className="border px-4 py-2">{sch.route}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Schedules;
