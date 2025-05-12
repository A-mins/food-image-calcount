
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUserProfile, calculateCalorieBudget, calculateMacroTargets } from "@/services/profileService";
import { getTodaysFoodEntries, getAllFoodEntries, FoodEntry } from "@/services/foodDiaryService";
import { Link } from 'react-router-dom';
import CalorieProgress from '@/components/CalorieProgress';
import RecentFoods from '@/components/RecentFoods';

const Dashboard = () => {
  const [profile, setProfile] = useState<any>(null);
  const [dailyCalories, setDailyCalories] = useState<number>(0);
  const [macros, setMacros] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [todaysEntries, setTodaysEntries] = useState<FoodEntry[]>([]);
  const [calorieData, setCalorieData] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = getUserProfile();
        if (userData) {
          setProfile(userData);
          const calories = calculateCalorieBudget(userData);
          setDailyCalories(calories);
          const macroData = calculateMacroTargets(calories, userData);
          setMacros({
            protein: {
              grams: macroData.protein,
              percentage: macroData.proteinCalories / calories,
            },
            carbs: {
              grams: macroData.carbs,
              percentage: macroData.carbCalories / calories,
            },
            fat: {
              grams: macroData.fat,
              percentage: macroData.fatCalories / calories,
            }
          });

          // Get today's food entries
          const entries = getTodaysFoodEntries();
          setTodaysEntries(entries);
          
          // Process weekly data for the chart
          processWeeklyData();
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const processWeeklyData = () => {
    const allEntries = getAllFoodEntries();
    const weeklyData: { [key: string]: { name: string, intake: number, expenditure: number } } = {};
    
    // Get dates for the past 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      weeklyData[dateStr] = {
        name: dayName,
        intake: 0,
        expenditure: calculateCalorieBudget(getUserProfile()!)
      };
    }
    
    // Sum up calories for each day
    allEntries.forEach(entry => {
      if (weeklyData[entry.date]) {
        weeklyData[entry.date].intake += entry.calories;
      }
    });
    
    // Convert to array for chart
    const chartData = Object.values(weeklyData);
    setCalorieData(chartData);
  };

  // Calculate total calories consumed today
  const calculateTotalCalories = () => {
    return todaysEntries.reduce((sum, entry) => sum + entry.calories, 0);
  };

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to CalorieTracker</h2>
            <p className="text-lg mb-6">Let's set up your profile to get started</p>
            <Button asChild>
              <Link to="/profile">Create Profile</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalCalories = calculateTotalCalories();
  const caloriesRemaining = dailyCalories - totalCalories;
  const percentConsumed = (totalCalories / dailyCalories) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Daily Calorie Budget Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Daily Calorie Budget</CardTitle>
                <CardDescription>Based on your profile and goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{dailyCalories}</div>
                <p className="text-sm text-gray-500 mt-2">
                  {profile.goal === 'lose' ? 'Calorie deficit for weight loss' : 
                   profile.goal === 'gain' ? 'Calorie surplus for weight gain' : 
                   'Calorie maintenance for weight stability'}
                </p>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/profile">Update Profile</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Macronutrient Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Macronutrient Breakdown</CardTitle>
                <CardDescription>Recommended daily intake</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                {macros && (
                  <div className="flex justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Protein', value: macros.protein.percentage },
                            { name: 'Carbs', value: macros.carbs.percentage },
                            { name: 'Fat', value: macros.fat.percentage }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[0, 1, 2].map((index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-2 text-center text-sm mt-2">
                  <div>
                    <p className="font-bold">{macros?.protein.grams}g</p>
                    <p className="text-xs">Protein</p>
                  </div>
                  <div>
                    <p className="font-bold">{macros?.carbs.grams}g</p>
                    <p className="text-xs">Carbs</p>
                  </div>
                  <div>
                    <p className="font-bold">{macros?.fat.grams}g</p>
                    <p className="text-xs">Fat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Today's Summary</CardTitle>
                <CardDescription>Your progress so far</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Calories Consumed</span>
                    <span className="font-semibold">{totalCalories} / {dailyCalories}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${Math.min(percentConsumed, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{percentConsumed.toFixed(0)}%</span>
                    <span>Remaining: {caloriesRemaining > 0 ? caloriesRemaining : 0}</span>
                  </div>
                  <Button className="w-full mt-2" asChild>
                    <Link to="/upload">Log Food</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Weekly Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Weekly Calorie Overview</CardTitle>
              <CardDescription>Intake vs. Expenditure</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={calorieData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="intake" name="Calories In" fill="#8884d8" />
                  <Bar dataKey="expenditure" name="Calories Out" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Recent Foods */}
          <RecentFoods entries={todaysEntries.slice(0, 3)} />
          
          {/* Quick Access */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-24 flex flex-col" asChild>
              <Link to="/upload">
                <span className="text-xl">📸</span>
                <span>Scan Food</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col" disabled>
              <span className="text-xl">📊</span>
              <span>Progress</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col" disabled>
              <span className="text-xl">🥗</span>
              <span>Meal Plans</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col" disabled>
              <span className="text-xl">⚙️</span>
              <span>Settings</span>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
