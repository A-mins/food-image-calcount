
export interface UserProfile {
  gender: 'male' | 'female' | 'other';
  age: number;
  weight: number;
  height: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose' | 'maintain' | 'gain';
}

export interface MacroNutrients {
  protein: {
    grams: number;
    calories: number;
    percentage: number;
  };
  carbs: {
    grams: number;
    calories: number;
    percentage: number;
  };
  fat: {
    grams: number;
    calories: number;
    percentage: number;
  };
}

// Saves the user profile to localStorage
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem('userProfile', JSON.stringify(profile));
};

// Gets the user profile from localStorage
export const getUserProfile = (): UserProfile | null => {
  const storedProfile = localStorage.getItem('userProfile');
  if (storedProfile) {
    return JSON.parse(storedProfile);
  }
  return null;
};

// Calculate daily calorie needs based on user profile
export const calculateDailyCalories = (profile: UserProfile): number => {
  // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
  let bmr;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  // Apply activity multiplier
  let activityMultiplier;
  switch (profile.activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'active':
      activityMultiplier = 1.725;
      break;
    case 'very_active':
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.2;
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * activityMultiplier);

  // Adjust for goal
  let goalAdjustment;
  switch (profile.goal) {
    case 'lose':
      goalAdjustment = -500; // Create a moderate caloric deficit
      break;
    case 'gain':
      goalAdjustment = 500; // Create a moderate caloric surplus
      break;
    case 'maintain':
    default:
      goalAdjustment = 0;
  }

  return Math.max(1200, tdee + goalAdjustment); // Minimum 1200 calories for safety
};

// Calculate macro nutrient breakdown
export const calculateMacros = (totalCalories: number, goal: string): MacroNutrients => {
  let proteinPercentage, carbsPercentage, fatPercentage;

  // Adjust macro ratio based on goal
  switch (goal) {
    case 'lose':
      proteinPercentage = 0.35; // Higher protein for satiety and muscle preservation
      carbsPercentage = 0.4;
      fatPercentage = 0.25;
      break;
    case 'gain':
      proteinPercentage = 0.3; // Balanced for muscle gain
      carbsPercentage = 0.45; // Higher carbs for energy
      fatPercentage = 0.25;
      break;
    case 'maintain':
    default:
      proteinPercentage = 0.3;
      carbsPercentage = 0.45;
      fatPercentage = 0.25;
  }

  // Calculate grams based on calories and percentages
  // Protein & carbs = 4 calories per gram, fat = 9 calories per gram
  const proteinCalories = totalCalories * proteinPercentage;
  const carbsCalories = totalCalories * carbsPercentage;
  const fatCalories = totalCalories * fatPercentage;

  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    protein: {
      grams: proteinGrams,
      calories: Math.round(proteinCalories),
      percentage: proteinPercentage
    },
    carbs: {
      grams: carbsGrams,
      calories: Math.round(carbsCalories),
      percentage: carbsPercentage
    },
    fat: {
      grams: fatGrams,
      calories: Math.round(fatCalories),
      percentage: fatPercentage
    }
  };
};

// Sample data for weekly calorie tracking
export const getWeeklyCalorieData = () => {
  return [
    { name: 'Mon', intake: 1800, expenditure: 2100 },
    { name: 'Tue', intake: 2000, expenditure: 2200 },
    { name: 'Wed', intake: 1900, expenditure: 2150 },
    { name: 'Thu', intake: 2100, expenditure: 2300 },
    { name: 'Fri', intake: 2300, expenditure: 2250 },
    { name: 'Sat', intake: 2200, expenditure: 2400 },
    { name: 'Sun', intake: 1950, expenditure: 2050 },
  ];
};
