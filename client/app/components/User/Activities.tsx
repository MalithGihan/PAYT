import React from 'react';
import { FaTrashAlt, FaRecycle, FaTruck } from 'react-icons/fa';

const Activities = () => {
  const activities = [
    {
      id: 1,
      title: 'Garbage Collection',
      description: 'Weekly garbage collection by the city trucks every Monday and Thursday.',
      icon: <FaTruck size={30} className="text-blue-600" />,
    },
    {
      id: 2,
      title: 'Recycling Initiative',
      description: 'Join the recycling initiative to reduce plastic waste. Recycling bins are available at local parks.',
      icon: <FaRecycle size={30} className="text-green-600" />,
    },
    {
      id: 3,
      title: 'Waste Segregation',
      description: 'Learn how to segregate waste for composting, recycling, and safe disposal.',
      icon: <FaTrashAlt size={30} className="text-red-600" />,
    },
  ];

  return (
    <div className="w-full min-h-screen py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Garbage Management Activities</h1>
      <div className="w-4/5 mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center justify-between"
          >
            <div className="flex items-center justify-center mb-4">
              {activity.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
            <p className="text-gray-700 text-center">{activity.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activities;
