
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface FoodItem {
  name: string;
  calories: number;
  imageUrl: string;
}

const FoodGallery: React.FC = () => {
  const foods: FoodItem[] = [
    {
      name: "Avocado Toast",
      calories: 290,
      imageUrl: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Greek Salad",
      calories: 230,
      imageUrl: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?q=80&w=2064&auto=format&fit=crop"
    },
    {
      name: "Chicken Sandwich",
      calories: 450,
      imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?q=80&w=1974&auto=format&fit=crop"
    },
    {
      name: "Berry Smoothie",
      calories: 180,
      imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a90bb0b1?q=80&w=1972&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-16 px-6" id="gallery">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Food Gallery</h2>
        <p className="text-gray-600 text-center mb-10">
          Examples of common foods and their calorie content
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.map((food, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer">
              <div className="h-48 overflow-hidden">
                <img 
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{food.name}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {food.calories} cal
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodGallery;
