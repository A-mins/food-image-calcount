import { toast } from "sonner";

// Interface for the OpenAI API response
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
}

interface CalorieEstimationResult {
  calories: string;
  explanation: string;
  success: boolean;
}

interface FoodDescriptionResult {
  description: string;
  nutritionalInfo: {
    calories: string;
    protein: string;
    carbohydrates: string;
    fat: string;
    fiber: string;
    sodium: string;
  };
  success: boolean;
}

// You should replace this with your valid API key
// For security, consider using environment variables in production
const OPENAI_API_KEY = "";

/**
 * Send a food description to OpenAI API for calorie estimation
 */
export const estimateCalories = async (
  description: string
): Promise<CalorieEstimationResult> => {
  if (!OPENAI_API_KEY) {
    toast.error("No API key available");
    return {
      calories: "0",
      explanation: "API key is required for calorie estimation.",
      success: false,
    };
  }

  try {
    const payload = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a nutrition expert." },
        {
          role: "user",
          content: `A user uploaded a food photo. Based on the description: '${description}', estimate total calories and give a short explanation.`,
        },
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`API Error: ${errorData.error?.message || "Unknown error"}`);
      return {
        calories: "0",
        explanation: `API Error: ${errorData.error?.message || "Unknown error"}`,
        success: false,
      };
    }

    const data = await response.json() as OpenAIResponse;
    
    const content = data.choices[0]?.message?.content || "";
    
    // Extract estimated calories and explanation
    let caloriesMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:kcal|calories)/i);
    let calories = caloriesMatch ? caloriesMatch[1] : "Unknown";
    
    // Get the explanation part
    let explanation = content;
    
    // Remove any "Estimated Calories: X kcal" pattern from the beginning if present
    explanation = explanation.replace(/^Estimated Calories:[\s\d]+kcal/i, "").trim();
    // Remove any "Breakdown:" prefix if present
    explanation = explanation.replace(/^Breakdown:/i, "").trim();
    
    return {
      calories,
      explanation,
      success: true,
    };
  } catch (error) {
    console.error("Error estimating calories:", error);
    toast.error("Failed to estimate calories. Please try again.");
    return {
      calories: "0",
      explanation: "Error connecting to OpenAI API.",
      success: false,
    };
  }
};

/**
 * Generate a description of the food in the image along with nutritional information
 */
export const generateFoodDescription = async (file: File): Promise<FoodDescriptionResult> => {
  if (!OPENAI_API_KEY) {
    toast.error("No API key available");
    return {
      description: "Unable to analyze food without API key.",
      nutritionalInfo: {
        calories: "0",
        protein: "0g",
        carbohydrates: "0g",
        fat: "0g",
        fiber: "0g",
        sodium: "0mg"
      },
      success: false
    };
  }
  
  try {
    // In a real app, this would analyze the actual image using OpenAI Vision API
    // For this prototype, we'll use the file name to create a prompt
    const fileName = file.name.toLowerCase();
    let foodType = "food";
    
    if (fileName.includes("salad")) {
      foodType = "garden salad";
    } else if (fileName.includes("burger") || fileName.includes("hamburger")) {
      foodType = "hamburger with fries";
    } else if (fileName.includes("pizza")) {
      foodType = "pizza slices";
    } else if (fileName.includes("fruit")) {
      foodType = "fruit bowl";
    } else if (fileName.includes("chicken")) {
      foodType = "grilled chicken with vegetables";
    }
    
    const payload = {
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a nutrition expert. Provide detailed food descriptions and nutritional information in a structured format."
        },
        {
          role: "user",
          content: `A user uploaded a photo of ${foodType}. Please provide:
          1. A detailed description of what this food likely contains (2-3 sentences)
          2. Nutritional information in EXACTLY this format:
          
          Calories: [number] kcal
          Protein: [number]g
          Carbohydrates: [number]g
          Fat: [number]g
          Fiber: [number]g
          Sodium: [number]mg
          
          Be reasonably accurate with your nutritional estimates for a standard serving.`
        },
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`API Error: ${errorData.error?.message || "Unknown error"}`);
      return {
        description: `Error: ${errorData.error?.message || "Unknown error"}`,
        nutritionalInfo: {
          calories: "0",
          protein: "0g",
          carbohydrates: "0g",
          fat: "0g",
          fiber: "0g",
          sodium: "0mg"
        },
        success: false
      };
    }

    const data = await response.json() as OpenAIResponse;
    const content = data.choices[0]?.message?.content || "";
    
    // Split the content into description and nutritional info
    const parts = content.split(/Calories:/i);
    const description = parts[0].trim();
    
    // Parse nutritional information
    const nutritionalText = "Calories:" + (parts[1] || "");
    
    const caloriesMatch = nutritionalText.match(/Calories:\s*(\d+(?:\.\d+)?)/i);
    const proteinMatch = nutritionalText.match(/Protein:\s*(\d+(?:\.\d+)?)/i);
    const carbsMatch = nutritionalText.match(/Carbohydrates:\s*(\d+(?:\.\d+)?)/i);
    const fatMatch = nutritionalText.match(/Fat:\s*(\d+(?:\.\d+)?)/i);
    const fiberMatch = nutritionalText.match(/Fiber:\s*(\d+(?:\.\d+)?)/i);
    const sodiumMatch = nutritionalText.match(/Sodium:\s*(\d+(?:\.\d+)?)/i);
    
    return {
      description,
      nutritionalInfo: {
        calories: caloriesMatch ? caloriesMatch[1] + " kcal" : "Unknown",
        protein: proteinMatch ? proteinMatch[1] + "g" : "Unknown",
        carbohydrates: carbsMatch ? carbsMatch[1] + "g" : "Unknown",
        fat: fatMatch ? fatMatch[1] + "g" : "Unknown",
        fiber: fiberMatch ? fiberMatch[1] + "g" : "Unknown",
        sodium: sodiumMatch ? sodiumMatch[1] + "mg" : "Unknown"
      },
      success: true
    };
  } catch (error) {
    console.error("Error generating food description:", error);
    toast.error("Failed to analyze food. Please try again.");
    return {
      description: "Error analyzing food image.",
      nutritionalInfo: {
        calories: "0",
        protein: "0g",
        carbohydrates: "0g",
        fat: "0g",
        fiber: "0g",
        sodium: "0mg"
      },
      success: false
    };
  }
};
