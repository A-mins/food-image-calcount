
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FoodEntry } from "@/services/foodDiaryService";

interface RecentFoodsProps {
  entries: FoodEntry[];
}

const RecentFoods: React.FC<RecentFoodsProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Foods</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="mb-4">No food entries recorded today.</p>
          <Button asChild>
            <Link to="/upload">Log your first meal</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Today's Food</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link to="/upload">Log More</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center space-x-4">
              {entry.imageUrl && (
                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={entry.imageUrl} 
                    alt={entry.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-medium text-sm">{entry.name}</h4>
                <p className="text-xs text-gray-500">{entry.time}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{entry.calories} kcal</p>
                <div className="text-xs text-gray-500">
                  P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentFoods;
