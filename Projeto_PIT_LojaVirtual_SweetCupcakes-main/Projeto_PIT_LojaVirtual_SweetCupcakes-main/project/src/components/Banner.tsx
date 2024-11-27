import React from 'react';
import { Cherry } from 'lucide-react';

const Banner: React.FC = () => {
  return (
    <div className="bg-[#011206] text-white py-16 relative overflow-hidden">
      {/* Background Sprinkles */}
      <div className="absolute inset-0">
        {/* Top row */}
        <div className="absolute top-4 left-1/4 w-2 h-6 bg-yellow-400 rotate-45 rounded-full" />
        <div className="absolute top-8 left-1/2 w-2 h-4 bg-pink-500 -rotate-12 rounded-full" />
        <div className="absolute top-6 right-1/4 w-2 h-5 bg-blue-400 rotate-[60deg] rounded-full" />
        <div className="absolute top-12 right-1/3 w-2 h-4 bg-green-400 rotate-[120deg] rounded-full" />
        
        {/* Middle row */}
        <div className="absolute top-1/2 left-10 w-2 h-5 bg-purple-400 -rotate-45 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-2 h-4 bg-orange-400 rotate-[30deg] rounded-full" />
        <div className="absolute top-1/2 right-10 w-2 h-6 bg-red-400 rotate-[15deg] rounded-full" />
        <div className="absolute top-1/2 right-1/3 w-2 h-4 bg-blue-300 rotate-[75deg] rounded-full" />
        
        {/* Bottom row */}
        <div className="absolute bottom-8 left-1/4 w-2 h-5 bg-pink-400 rotate-[100deg] rounded-full" />
        <div className="absolute bottom-12 left-2/3 w-2 h-4 bg-yellow-300 rotate-[45deg] rounded-full" />
        <div className="absolute bottom-6 right-1/4 w-2 h-6 bg-green-300 -rotate-[30deg] rounded-full" />
        <div className="absolute bottom-10 right-1/2 w-2 h-4 bg-purple-300 rotate-[60deg] rounded-full" />
        
        {/* Additional scattered sprinkles */}
        <div className="absolute top-1/4 left-20 w-2 h-4 bg-orange-300 rotate-[90deg] rounded-full" />
        <div className="absolute top-3/4 right-20 w-2 h-5 bg-pink-300 -rotate-[15deg] rounded-full" />
        <div className="absolute top-1/3 right-40 w-2 h-4 bg-blue-400 rotate-[120deg] rounded-full" />
        <div className="absolute bottom-1/3 left-40 w-2 h-5 bg-yellow-400 rotate-[75deg] rounded-full" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold">Sweet Cupcake</h1>
              {/* Cherry icon */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Cherry 
                  className="w-20 h-20 text-red-500" 
                  strokeWidth={1.5}
                />
                {/* Shine effect */}
                <div className="absolute top-4 left-6 w-3 h-3 bg-white/30 rounded-full" />
              </div>
            </div>
            <p className="text-xl text-white/80">Sabores que encantam, momentos que adoçam</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;