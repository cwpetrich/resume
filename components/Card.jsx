import React from 'react';

const Card = () => {
  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-cover bg-center h-56 p-4" style={{ backgroundImage: "url('https://via.placeholder.com/400x300')" }}>
        <div className="flex justify-end">
          <svg className="h-6 w-6 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>
      <div className="p-4">
        <h1 className="text-gray-900 font-bold text-2xl">Beautiful Card</h1>
        <p className="mt-2 text-gray-600 text-sm">This is a simple card component built with React and styled using Tailwind CSS. It is responsive and easy to customize.</p>
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-gray-700 font-bold text-xl">$25</h1>
          <button className="px-3 py-2 bg-gray-800 text-white text-xs font-bold uppercase rounded">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Card;