
import { toast } from "sonner";

export interface FoodNutritionData {
  foodName: string;
  calories: number;
  nutrition: {
    name: string;
    value: number;
    unit: string;
    percentage: number;
  }[];
  confidence: number;
}

// This function analyzes a food image and returns nutrition data
export const analyzeFoodImage = async (file: File): Promise<FoodNutritionData> => {
  try {
    // Create form data to send the image
    const formData = new FormData();
    formData.append('file', file);
    
    // In a production app, you would replace this with your actual API endpoint
    // For example: const response = await fetch('https://api.calories.ai/analyze', { method: 'POST', body: formData });
    
    // For now, we'll simulate an API call with a delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the file extension and name to help simulate different food types
    const fileName = file.name.toLowerCase();
    
    // Analyze the image name to simulate different foods (in a real app, AI would do this)
    let result: FoodNutritionData;
    
    if (fileName.includes("salad") || fileName.includes("vegetable") || fileName.includes("veg")) {
      result = generateSaladNutritionData();
    } else if (fileName.includes("burger") || fileName.includes("hamburger")) {
      result = generateBurgerNutritionData();
    } else if (fileName.includes("pizza")) {
      result = generatePizzaNutritionData();
    } else if (fileName.includes("fruit") || fileName.includes("apple") || fileName.includes("banana")) {
      result = generateFruitNutritionData();
    } else if (fileName.includes("chicken") || fileName.includes("meat")) {
      result = generateChickenNutritionData();
    } else {
      // Default to random food data
      const foods = [
        generateSaladNutritionData,
        generateBurgerNutritionData,
        generatePizzaNutritionData,
        generateFruitNutritionData,
        generateChickenNutritionData
      ];
      result = foods[Math.floor(Math.random() * foods.length)]();
    }
    
    return result;
  } catch (error) {
    console.error("Error analyzing food image:", error);
    toast.error("Failed to analyze the food image. Please try again.");
    throw new Error("Failed to analyze food image");
  }
};

// Helper functions to generate sample nutrition data for different food types
function generateSaladNutritionData(): FoodNutritionData {
  return {
    foodName: "Garden Salad",
    calories: 120,
    confidence: 0.92,
    nutrition: [
      { name: "Protein", value: 3, unit: "g", percentage: 6 },
      { name: "Carbohydrates", value: 12, unit: "g", percentage: 4 },
      { name: "Fat", value: 7, unit: "g", percentage: 9 },
      { name: "Fiber", value: 5, unit: "g", percentage: 20 },
      { name: "Sodium", value: 120, unit: "mg", percentage: 5 }
    ]
  };
}

function generateBurgerNutritionData(): FoodNutritionData {
  return {
    foodName: "Beef Burger",
    calories: 540,
    confidence: 0.96,
    nutrition: [
      { name: "Protein", value: 25, unit: "g", percentage: 50 },
      { name: "Carbohydrates", value: 40, unit: "g", percentage: 13 },
      { name: "Fat", value: 33, unit: "g", percentage: 42 },
      { name: "Fiber", value: 2, unit: "g", percentage: 8 },
      { name: "Sodium", value: 950, unit: "mg", percentage: 41 }
    ]
  };
}

function generatePizzaNutritionData(): FoodNutritionData {
  return {
    foodName: "Cheese Pizza Slice",
    calories: 285,
    confidence: 0.89,
    nutrition: [
      { name: "Protein", value: 12, unit: "g", percentage: 24 },
      { name: "Carbohydrates", value: 36, unit: "g", percentage: 12 },
      { name: "Fat", value: 10, unit: "g", percentage: 13 },
      { name: "Fiber", value: 2, unit: "g", percentage: 8 },
      { name: "Sodium", value: 640, unit: "mg", percentage: 28 }
    ]
  };
}

function generateFruitNutritionData(): FoodNutritionData {
  return {
    foodName: "Mixed Fruit Bowl",
    calories: 95,
    confidence: 0.94,
    nutrition: [
      { name: "Protein", value: 1, unit: "g", percentage: 2 },
      { name: "Carbohydrates", value: 25, unit: "g", percentage: 8 },
      { name: "Fat", value: 0.3, unit: "g", percentage: 0 },
      { name: "Fiber", value: 4, unit: "g", percentage: 16 },
      { name: "Sugar", value: 18, unit: "g", percentage: 36 }
    ]
  };
}

function generateChickenNutritionData(): FoodNutritionData {
  return {
    foodName: "Grilled Chicken",
    calories: 320,
    confidence: 0.91,
    nutrition: [
      { name: "Protein", value: 28, unit: "g", percentage: 56 },
      { name: "Carbohydrates", value: 12, unit: "g", percentage: 4 },
      { name: "Fat", value: 18, unit: "g", percentage: 23 },
      { name: "Fiber", value: 0, unit: "g", percentage: 0 },
      { name: "Sodium", value: 520, unit: "mg", percentage: 22 }
    ]
  };
}
