
import React from 'react';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { HandTracker } from './components/HandTracker';

const App: React.FC = () => {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Scene />
      <UI />
      <HandTracker />
      
      {/* Background Gradients for Aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-900 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900 rounded-full blur-[150px]" />
      </div>
    </div>
  );
};

export default App;
