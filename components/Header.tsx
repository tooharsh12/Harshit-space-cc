
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative text-center p-8 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
      <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
        Harshit's Space
      </h1>
      <p className="mt-2 text-xl text-cyan-200">Try Your Cloth</p>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Visualize Your Style in a Flash. Upload your photo, pick an outfit, and let our AI create your new look.
      </p>
    </header>
  );
};

export default Header;
