
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

// Hardcoded OpenAI API key - Replace with your actual API key if needed
const OPENAI_API_KEY = "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"; 

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
 * Generate a description of the food in the image
 * This is a placeholder function that will be replaced with actual image recognition
 * In a production app, this would use an AI model to analyze the image
 */
export const generateFoodDescription = async (file: File): Promise<string> => {
  // In a real app, you would send the image to an image recognition API
  // For this prototype, we'll simulate a delay and return a generic description based on the file name
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes("salad")) {
    return "A garden salad with lettuce, tomatoes, cucumber, and a light vinaigrette dressing. Single portion on a medium-sized plate.";
  } else if (fileName.includes("burger") || fileName.includes("hamburger")) {
    return "Beef hamburger on a sesame seed bun with lettuce, tomato, cheese, and sauce. Served with a side of french fries. Standard restaurant serving size.";
  } else if (fileName.includes("pizza")) {
    return "Two slices of cheese pizza with tomato sauce and mozzarella cheese on a thin crust. Medium-sized slices.";
  } else if (fileName.includes("fruit")) {
    return "A fruit bowl containing sliced apple, banana, strawberries, and blueberries. Approximately 2 cups in volume.";
  } else if (fileName.includes("chicken")) {
    return "Grilled chicken breast with steamed vegetables (broccoli, carrots) and a small portion of white rice. Restaurant portion, approximately 6oz of chicken.";
  } else {
    return "A food dish that appears to contain mixed ingredients. Unable to identify specific components. Appears to be a single serving portion.";
  }
};
