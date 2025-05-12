
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from '@/components/ImageUploader';
import { FoodNutritionData } from '@/services/calorieService';
import CalorieResult from '@/components/CalorieResult';
import { generateFoodDescription } from '@/services/openaiService';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const FoodScanner = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<FoodNutritionData | null>(null);
  const [foodDescription, setFoodDescription] = useState<string>('');
  const [aiNutrition, setAiNutrition] = useState<{
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    sodium: string;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleImageUpload = (file: File) => {
    setSelectedImage(file);
    setNutritionData(null);
    setAiNutrition(null);
    setFoodDescription('');
    setShowResults(false);
  };

  const handleAnalysisComplete = async (imgUrl: string, result: FoodNutritionData) => {
    setImageUrl(imgUrl);
    setNutritionData(result);
    setIsAnalyzing(true);
    
    try {
      // Generate food description and nutritional info using OpenAI
      const foodAnalysis = await generateFoodDescription(selectedImage!);
      if (foodAnalysis.success) {
        setFoodDescription(foodAnalysis.description);
        setAiNutrition(foodAnalysis.nutritionalInfo);
      }
      
      setShowResults(true);
    } catch (error) {
      console.error("Error in analysis workflow:", error);
    } finally {
      setIsAnalyzing(false);
    }
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
                      <CardTitle>AI Food Analysis</CardTitle>
                      <CardDescription>Detailed food description and nutritional breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Description:</h4>
                        <p className="text-gray-700">{foodDescription}</p>
                      </div>
                      
                      {aiNutrition && (
                        <div>
                          <h4 className="font-medium mb-2">Nutritional Information:</h4>
                          <div className="grid grid-cols-2 gap-y-2">
                            <div className="text-gray-700">Calories:</div>
                            <div className="font-semibold">{aiNutrition.calories}</div>
                            
                            <div className="text-gray-700">Protein:</div>
                            <div>{aiNutrition.protein}</div>
                            
                            <div className="text-gray-700">Carbohydrates:</div>
                            <div>{aiNutrition.carbohydrates}</div>
                            
                            <div className="text-gray-700">Fat:</div>
                            <div>{aiNutrition.fat}</div>
                            
                            <div className="text-gray-700">Fiber:</div>
                            <div>{aiNutrition.fiber}</div>
                            
                            <div className="text-gray-700">Sodium:</div>
                            <div>{aiNutrition.sodium}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {isAnalyzing && (
                  <Card className="bg-gray-50">
                    <CardContent className="p-4 flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Analyzing food with AI...</span>
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
