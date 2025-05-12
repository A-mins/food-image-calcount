
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-500 to-green-300 flex items-center justify-center">
                <span className="text-white font-bold">C</span>
              </div>
              <span className="font-bold text-xl">CalorieVision</span>
            </div>
            <p className="text-gray-600">
              Make healthier food choices with our AI-powered calorie detection.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#gallery" className="text-gray-600 hover:text-primary transition-colors">Food Gallery</a></li>
              <li><a href="#upload" className="text-gray-600 hover:text-primary transition-colors">Analyze Food</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Contact</h3>
            <p className="text-gray-600 mb-2">Have questions or feedback?</p>
            <a href="mailto:info@calorievision.app" className="text-primary hover:underline">
              info@calorievision.app
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CalorieVision. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
