
import { toast } from "sonner";
import { UserProfile } from "@/types/user";

// Save user profile to local storage
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    localStorage.setItem('user_profile', JSON.stringify(profile));
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving profile:', error);
    return Promise.reject(error);
  }
};

// Get user profile from local storage with default sample data if not found
export const getUserProfile = (): UserProfile | null => {
  try {
    const profileData = localStorage.getItem('user_profile');
    
    if (profileData) {
      return JSON.parse(profileData);
    } else {
      // Default sample profile data
      const sampleProfile: UserProfile = {
        gender: 'male',
        age: 32,
        weight: 75,
        height: 178,
        activityLevel: 'moderate',
        goal: 'maintain'
      };
      
      // Automatically save the sample profile
      localStorage.setItem('user_profile', JSON.stringify(sampleProfile));
      return sampleProfile;
    }
  } catch (error) {
    console.error('Error retrieving profile:', error);
    toast.error('Error retrieving your profile data');
    return null;
  }
};

// Calculate daily calorie budget based on user profile and goals
export const calculateCalorieBudget = (profile: UserProfile): number => {
  // Base Metabolic Rate (BMR) calculation using Mifflin-St Jeor Equation
  let bmr;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Active 6-7 days/week
    very_active: 1.9     // Very active daily
  };
  
  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * activityMultipliers[profile.activityLevel];
  
  // Adjust based on goal
  let calorieAdjustment = 0;
  if (profile.goal === 'lose') {
    calorieAdjustment = -500; // Deficit for weight loss
  } else if (profile.goal === 'gain') {
    calorieAdjustment = 500;  // Surplus for weight gain
  }
  
  return Math.round(tdee + calorieAdjustment);
};

// Calculate macronutrient targets based on calorie budget
export const calculateMacroTargets = (calorieTarget: number, profile: UserProfile) => {
  let proteinPercentage, carbPercentage, fatPercentage;
  
  // Set macronutrient percentages based on goals
  if (profile.goal === 'lose') {
    proteinPercentage = 0.35; // Higher protein for weight loss
    carbPercentage = 0.40;
    fatPercentage = 0.25;
  } else if (profile.goal === 'gain') {
    proteinPercentage = 0.25;
    carbPercentage = 0.50; // Higher carbs for weight gain
    fatPercentage = 0.25;
  } else {
    // Maintain
    proteinPercentage = 0.30;
    carbPercentage = 0.45;
    fatPercentage = 0.25;
  }
  
  // Calculate grams per macronutrient
  // Protein and carbs have 4 calories per gram, fat has 9 calories per gram
  const proteinGrams = Math.round((calorieTarget * proteinPercentage) / 4);
  const carbGrams = Math.round((calorieTarget * carbPercentage) / 4);
  const fatGrams = Math.round((calorieTarget * fatPercentage) / 9);
  
  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
    proteinCalories: proteinGrams * 4,
    carbCalories: carbGrams * 4,
    fatCalories: fatGrams * 9,
  };
};
