
import { toast } from "sonner";

// Define the food entry interface
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  imageUrl?: string;
  time?: string;
}

// Get today's food entries
export const getTodaysFoodEntries = (): FoodEntry[] => {
  try {
    const entries = localStorage.getItem('food_entries');
    if (entries) {
      const allEntries: FoodEntry[] = JSON.parse(entries);
      const today = new Date().toISOString().split('T')[0];
      return allEntries.filter(entry => entry.date === today);
    }
    
    // If no entries exist, initialize with sample data for today
    const sampleEntries = generateSampleFoodEntries();
    localStorage.setItem('food_entries', JSON.stringify(sampleEntries));
    
    const today = new Date().toISOString().split('T')[0];
    return sampleEntries.filter(entry => entry.date === today);
  } catch (error) {
    console.error("Error getting food entries:", error);
    toast.error("Failed to load food entries");
    return [];
  }
};

// Get all food entries
export const getAllFoodEntries = (): FoodEntry[] => {
  try {
    const entries = localStorage.getItem('food_entries');
    if (entries) {
      return JSON.parse(entries);
    }
    
    // If no entries exist, initialize with sample data
    const sampleEntries = generateSampleFoodEntries();
    localStorage.setItem('food_entries', JSON.stringify(sampleEntries));
    return sampleEntries;
  } catch (error) {
    console.error("Error getting all food entries:", error);
    toast.error("Failed to load food entries");
    return [];
  }
};

// Add food entry
export const addFoodEntry = (entry: FoodEntry): void => {
  try {
    const entries = getAllFoodEntries();
    entries.push(entry);
    localStorage.setItem('food_entries', JSON.stringify(entries));
    toast.success("Food entry added successfully!");
  } catch (error) {
    console.error("Error adding food entry:", error);
    toast.error("Failed to add food entry");
  }
};

// Generate sample food entries for the past 7 days
const generateSampleFoodEntries = (): FoodEntry[] => {
  const entries: FoodEntry[] = [];
  
  // Generate entries for the past 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Add breakfast
    entries.push({
      id: `breakfast-${dateStr}`,
      name: "Oatmeal with Banana",
      calories: 320,
      protein: 10,
      carbs: 58,
      fat: 6,
      date: dateStr,
      time: "08:00",
      imageUrl: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&auto=format"
    });
    
    // Add lunch
    entries.push({
      id: `lunch-${dateStr}`,
      name: "Chicken Salad",
      calories: 450,
      protein: 35,
      carbs: 25,
      fat: 22,
      date: dateStr,
      time: "13:00",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format"
    });
    
    // Add dinner
    entries.push({
      id: `dinner-${dateStr}`,
      name: i % 2 === 0 ? "Salmon with Vegetables" : "Pasta with Tomato Sauce",
      calories: i % 2 === 0 ? 520 : 480,
      protein: i % 2 === 0 ? 38 : 16,
      carbs: i % 2 === 0 ? 22 : 84,
      fat: i % 2 === 0 ? 32 : 6,
      date: dateStr,
      time: "19:00",
      imageUrl: i % 2 === 0 
        ? "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format"
        : "https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=500&auto=format"
    });
    
    // Add snack
    if (i % 2 === 0) {
      entries.push({
        id: `snack-${dateStr}`,
        name: "Greek Yogurt with Berries",
        calories: 180,
        protein: 15,
        carbs: 22,
        fat: 4,
        date: dateStr,
        time: "16:00",
        imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format"
      });
    }
  }
  
  return entries;
};
