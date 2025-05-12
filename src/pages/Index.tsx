
import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImageUploader from '@/components/ImageUploader';
import CalorieResult from '@/components/CalorieResult';
import FoodGallery from '@/components/FoodGallery';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analyzeClicked, setAnalyzeClicked] = useState(false);
  
  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setAnalyzeClicked(false);
  };

  // Demo data for the calorie result (simulating AI analysis)
  const demoNutritionData = {
    foodName: "Grilled Chicken Salad",
    calories: 320,
    nutrition: [
      { name: "Protein", value: 28, unit: "g", percentage: 56 },
      { name: "Carbohydrates", value: 12, unit: "g", percentage: 4 },
      { name: "Fat", value: 18, unit: "g", percentage: 23 },
      { name: "Fiber", value: 4, unit: "g", percentage: 16 },
      { name: "Sodium", value: 520, unit: "mg", percentage: 22 },
    ],
    imageUrl: selectedImage ? URL.createObjectURL(selectedImage) : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        <Hero />
        
        <section className="py-16 px-6 bg-gray-50" id="how-it-works">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-2 text-center">How It Works</h2>
            <p className="text-gray-600 text-center mb-10">
              Get accurate calorie information in just a few simple steps
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">1</div>
                  <div>
                    <CardTitle>Upload</CardTitle>
                    <CardDescription>Take or upload a photo of your food</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Simply snap a photo of your meal or upload an existing image from your device.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">2</div>
                  <div>
                    <CardTitle>Analyze</CardTitle>
                    <CardDescription>Our AI analyzes the food</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our advanced AI identifies the food items and calculates their nutritional content.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">3</div>
                  <div>
                    <CardTitle>Results</CardTitle>
                    <CardDescription>View detailed nutrition info</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get a breakdown of calories, macronutrients, and more to help you make better dietary choices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <FoodGallery />
        
        <section className="py-16 px-6" id="upload">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-2 text-center">Analyze Your Food</h2>
            <p className="text-gray-600 text-center mb-10">
              Upload an image of your meal to get detailed calorie information
            </p>
            
            <Tabs defaultValue="upload" className="max-w-4xl mx-auto">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="results" disabled={!selectedImage}>Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <ImageUploader onImageUpload={handleImageUpload} />
                {selectedImage && (
                  <div className="flex justify-center mt-6">
                    <button 
                      className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md transition-colors"
                      onClick={() => setAnalyzeClicked(true)}
                    >
                      Analyze Calories
                    </button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="results" className="mt-0">
                <CalorieResult 
                  foodName={demoNutritionData.foodName}
                  calories={demoNutritionData.calories}
                  nutrition={demoNutritionData.nutrition}
                  imageUrl={demoNutritionData.imageUrl}
                />
              </TabsContent>
            </Tabs>
            
            {analyzeClicked && selectedImage && (
              <div className="mt-10 animate-fade-in">
                <h3 className="text-2xl font-bold mb-6 text-center">Analysis Results</h3>
                <CalorieResult 
                  foodName={demoNutritionData.foodName}
                  calories={demoNutritionData.calories}
                  nutrition={demoNutritionData.nutrition}
                  imageUrl={demoNutritionData.imageUrl}
                />
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
