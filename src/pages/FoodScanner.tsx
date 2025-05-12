
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from '@/components/ImageUploader';
import { FoodNutritionData } from '@/services/calorieService';
import CalorieResult from '@/components/CalorieResult';
import { generateFoodDescription, estimateCalories } from '@/services/openaiService';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const FoodScanner = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<FoodNutritionData | null>(null);
  const [foodDescription, setFoodDescription] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('openai_api_key') || '';
  });
  const [calorieEstimate, setCalorieEstimate] = useState<{
    calories: string;
    explanation: string;
  } | null>(null);
  const [foodNutritionalInfo, setFoodNutritionalInfo] = useState<{
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    sodium: string;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setNutritionData(null);
    setCalorieEstimate(null);
    setFoodDescription('');
    setFoodNutritionalInfo(null);
    setShowResults(false);
  };

  const handleAnalysisComplete = async (imgUrl: string, result: FoodNutritionData) => {
    setImageUrl(imgUrl);
    setNutritionData(result);
    
    try {
      // Generate food description with nutritional info
      if (apiKey && selectedImage) {
        const foodDescResult = await generateFoodDescription(selectedImage, apiKey);
        if (foodDescResult.success) {
          setFoodDescription(foodDescResult.description);
          setFoodNutritionalInfo(foodDescResult.nutritionalInfo);
        }
        
        // Also get calorie estimate as before
        const estimate = await estimateCalories(foodDescResult.description, apiKey);
        if (estimate.success) {
          setCalorieEstimate({
            calories: estimate.calories,
            explanation: estimate.explanation
          });
        }
      }
      
      setShowResults(true);
    } catch (error) {
      console.error("Error in analysis workflow:", error);
    }
  };
  
  const saveApiKey = () => {
    localStorage.setItem('openai_api_key', apiKey);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-2 text-center">Food Scanner</h1>
          <p className="text-gray-600 text-center mb-10">
            Upload a photo of your food to analyze its calories
          </p>
          
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>OpenAI API Key</CardTitle>
                <CardDescription>
                  Enter your OpenAI API key to enable calorie estimation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="apiKeyScanner">API Key</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="apiKeyScanner"
                      type="password" 
                      value={apiKey} 
                      onChange={e => setApiKey(e.target.value)} 
                      placeholder="sk-..." 
                      className="flex-1"
                    />
                    <Button onClick={saveApiKey}>Save Key</Button>
                  </div>
                  <p className="text-xs text-gray-500">Your API key is stored locally and never sent to our servers</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {!showResults ? (
              <ImageUploader 
                onImageUpload={handleImageUpload} 
                onAnalysisComplete={handleAnalysisComplete} 
              />
            ) : (
              <div className="space-y-8">
                <Button 
                  variant="outline"
                  onClick={() => setShowResults(false)}
                  className="mb-4"
                >
                  ← Back to Scanner
                </Button>
                
                {nutritionData && imageUrl && (
                  <CalorieResult 
                    foodName={nutritionData.foodName}
                    calories={nutritionData.calories}
                    nutrition={nutritionData.nutrition}
                    imageUrl={imageUrl}
                    confidence={nutritionData.confidence}
                  />
                )}
                
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
                
                {foodNutritionalInfo && (
                  <Card className="bg-primary/5">
                    <CardHeader>
                      <CardTitle>AI Nutritional Analysis</CardTitle>
                      <CardDescription>Generated using OpenAI GPT-4</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium">Calories:</p>
                            <p>{foodNutritionalInfo.calories}</p>
                          </div>
                          <div>
                            <p className="font-medium">Protein:</p>
                            <p>{foodNutritionalInfo.protein}</p>
                          </div>
                          <div>
                            <p className="font-medium">Carbohydrates:</p>
                            <p>{foodNutritionalInfo.carbohydrates}</p>
                          </div>
                          <div>
                            <p className="font-medium">Fat:</p>
                            <p>{foodNutritionalInfo.fat}</p>
                          </div>
                          <div>
                            <p className="font-medium">Fiber:</p>
                            <p>{foodNutritionalInfo.fiber}</p>
                          </div>
                          <div>
                            <p className="font-medium">Sodium:</p>
                            <p>{foodNutritionalInfo.sodium}</p>
                          </div>
                        </div>
                      </div>
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
                ) : apiKey ? (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Calculating calorie estimate...</span>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 text-center">
                      <p>Enter your OpenAI API key above to get an AI-powered calorie estimate</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FoodScanner;
