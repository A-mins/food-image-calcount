import React, { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImageUploader from '@/components/ImageUploader';
import CalorieResult from '@/components/CalorieResult';
import FoodGallery from '@/components/FoodGallery';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodNutritionData } from '@/services/calorieService';
import { Loader2 } from "lucide-react";
import { generateFoodDescription, estimateCalories } from '@/services/openaiService';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<FoodNutritionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodDescription, setFoodDescription] = useState<string>('');
  const [calorieEstimate, setCalorieEstimate] = useState<{
    calories: string;
    explanation: string;
  } | null>(null);
  
  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setNutritionData(null); // Reset previous analysis
    setCalorieEstimate(null);
    setFoodDescription('');
  };

  const handleAnalysisComplete = async (imgUrl: string, result: FoodNutritionData) => {
    setImageUrl(imgUrl);
    setNutritionData(result);
    
    try {
      // Generate food description
      const description = await generateFoodDescription(selectedImage!);
      setFoodDescription(description);
      
      // Estimate calories using OpenAI
      const estimate = await estimateCalories(description);
      if (estimate.success) {
        setCalorieEstimate({
          calories: estimate.calories,
          explanation: estimate.explanation
        });
      }
    } catch (error) {
      console.error("Error in analysis workflow:", error);
    }
    
    setActiveTab('results');
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
            
            <Tabs 
              defaultValue="upload" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="max-w-4xl mx-auto"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="upload">Upload Image</TabsTrigger>
                <TabsTrigger value="results" disabled={!nutritionData}>Results</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="mt-0">
                <ImageUploader 
                  onImageUpload={handleImageUpload} 
                  onAnalysisComplete={handleAnalysisComplete} 
                />
              </TabsContent>
              
              <TabsContent value="results" className="mt-0">
                {nutritionData && imageUrl && (
                  <div className="space-y-8">
                    <CalorieResult 
                      foodName={nutritionData.foodName}
                      calories={nutritionData.calories}
                      nutrition={nutritionData.nutrition}
                      imageUrl={imageUrl}
                      confidence={nutritionData.confidence}
                    />
                    
                    {foodDescription && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Food Description</CardTitle>
                          <CardDescription>AI-generated description of your food</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{foodDescription}</p>
                        </CardContent>
                      </Card>
                    )}
                    
                    {calorieEstimate ? (
                      <Card className="bg-primary/5">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>AI Calorie Estimate</span>
                            <span className="text-xl font-bold text-primary">{calorieEstimate.calories} kcal</span>
                          </CardTitle>
                          <CardDescription>Estimated using OpenAI GPT-4</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <h4 className="font-medium">Breakdown:</h4>
                            <p className="text-gray-700">{calorieEstimate.explanation}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-gray-50">
                        <CardContent className="p-4 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Calculating calorie estimate...</span>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
