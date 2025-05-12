
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface NutritionInfo {
  name: string;
  value: number;
  unit: string;
  percentage?: number;
}

interface CalorieResultProps {
  foodName: string;
  calories: number;
  nutrition: NutritionInfo[];
  imageUrl: string;
  confidence?: number;
}

const CalorieResult: React.FC<CalorieResultProps> = ({ 
  foodName, 
  calories, 
  nutrition, 
  imageUrl,
  confidence 
}) => {
  return (
    <Card className="w-full max-w-xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-full">
          <img 
            src={imageUrl} 
            alt={foodName} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{foodName}</CardTitle>
              {confidence && (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {Math.round(confidence * 100)}% confidence
                </Badge>
              )}
            </div>
            <CardDescription>Nutritional Information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Calories</span>
                <span className="text-xl font-bold text-primary">{calories}</span>
              </div>
              <Progress value={100} className="h-2 bg-gray-100" />
            </div>

            <div className="space-y-4">
              {nutrition.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span>
                      {item.value}{item.unit} {item.percentage && `(${item.percentage}%)`}
                    </span>
                  </div>
                  {item.percentage && (
                    <Progress value={item.percentage} className="h-1 bg-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-500 pt-0 text-right">
            *Values are estimated based on visual analysis
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default CalorieResult;
