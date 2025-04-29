import React from "react";

const AlgorithmVisualizer: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-4">Algorithm Visualizer</h3>
      <div className="bg-gray-100 rounded-md p-6 flex items-center justify-center h-64">
        <p className="text-gray-500">Visualization engine coming soon!</p>
      </div>
      <div className="mt-4 flex gap-2 justify-center">
        <button className="btn btn-secondary px-2 py-1">Play</button>
        <button className="btn btn-outline px-2 py-1">Pause</button>
        <button className="btn btn-outline px-2 py-1">Step</button>
        <button className="btn btn-outline px-2 py-1">Reset</button>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
