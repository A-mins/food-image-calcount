
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <section className="pt-28 pb-16 px-6 md:pt-40 md:pb-24">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-700 via-green-500 to-green-400 bg-clip-text text-transparent">
              Discover Calories in Your Food with AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Upload a photo of your meal and instantly get nutritional information. 
              Make healthier choices with CalorieVision.
            </p>
            <div className="flex gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => document.getElementById('upload')?.scrollIntoView({behavior: 'smooth'})}
              >
                Analyze Your Food
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior: 'smooth'})}
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-xl animate-fade-in">
              <img 
                src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1974&auto=format&fit=crop" 
                alt="Healthy food plate" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-600">320</span>
                </div>
                <div>
                  <p className="font-medium">Calories detected</p>
                  <p className="text-sm text-gray-500">Vegetable salad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
