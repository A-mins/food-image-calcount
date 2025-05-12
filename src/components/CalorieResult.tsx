
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
}

const CalorieResult: React.FC<CalorieResultProps> = ({ foodName, calories, nutrition, imageUrl }) => {
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
            <CardTitle className="text-2xl">{foodName}</CardTitle>
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
        </div>
      </div>
    </Card>
  );
};

export default CalorieResult;
