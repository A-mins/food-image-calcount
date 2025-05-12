
import React from 'react';
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 md:px-8 bg-white/80 backdrop-blur-sm fixed top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-green-300 flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="font-bold text-xl">CalorieVision</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
            How it works
          </a>
          <a href="#gallery" className="text-gray-600 hover:text-primary transition-colors">
            Food Gallery
          </a>
          <a href="#upload" className="text-gray-600 hover:text-primary transition-colors">
            Analyze Food
          </a>
        </nav>
        
        <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
      </div>
    </header>
  );
};

export default Header;
