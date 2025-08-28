
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center p-4 mt-8 bg-gray-900/50 border-t border-gray-700/50">
      <p className="text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Harshit's Space. Powered by AI.
      </p>
    </footer>
  );
};

export default Footer;
