import React from "react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Tailwind is working! 🎉
      </h1>

      <p className="text-lg text-gray-700">
        If you see this styled nicely, Tailwind setup is perfect.
      </p>

      <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Test Button
      </button>
    </div>
  );
};

export default App;
