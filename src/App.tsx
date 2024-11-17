import React from 'react';
import { HandDetection } from './components/HandDetection';
import { Hand } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-teal-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-emerald-600 rounded-xl">
              <Hand className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Finger Counter</h1>
          </div>
          <p className="text-gray-600">Show your hand to count fingers in real-time</p>
        </header>

        <main>
          <HandDetection />
          
          <div className="mt-8 bg-white/80 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">How to use</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Hold your hand up to the camera</li>
              <li>• Keep your hand steady and fingers spread</li>
              <li>• The system will count your visible fingers</li>
              <li>• Try showing different numbers of fingers</li>
              <li>• Make sure you have good lighting</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;