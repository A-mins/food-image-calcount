
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CalorieProgressProps {
  consumed: number;
  target: number;
}

const CalorieProgress: React.FC<CalorieProgressProps> = ({ consumed, target }) => {
  const percentConsumed = Math.min((consumed / target) * 100, 100);
  const remaining = Math.max(target - consumed, 0);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Calorie Intake</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Consumed</span>
            <span className="font-semibold">{consumed} / {target}</span>
          </div>
          <Progress value={percentConsumed} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{percentConsumed.toFixed(0)}%</span>
            <span>{remaining} kcal remaining</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieProgress;
