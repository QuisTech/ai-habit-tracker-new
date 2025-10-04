"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { supabase } from "@/lib/supabaseClient";

// ✅ Define types
interface Habit {
  id: number;
  name: string;
  description: string;
  completed: boolean;
}

interface SuggestionResponse {
  suggestion: string;
}

interface AuthData {
  user: any;
  session: any;
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  
  const habitSuggestions = [
  // 🌅 Morning Routines
  "Drink a glass of water as soon as you wake up 💧",
  "Make your bed first thing in the morning 🛏️",
  "5-minute morning stretch routine 🧘‍♂️",
  "Write down your top 3 priorities for the day 📝",
  "Avoid phone for first 30 minutes after waking up 📵",
  "Eat a protein-rich breakfast 🍳",
  "10-minute morning meditation 🧠",
  "Morning gratitude journaling 📔",
  "Plan your outfit the night before 👔",
  "Listen to uplifting music while getting ready 🎵",

  // 💪 Health & Fitness
  "Take a 10-minute walk after each meal 🚶‍♀️",
  "Do 10 pushups every hour 🏋️‍♂️",
  "Stand up and stretch every 30 minutes 🏃‍♂️",
  "Take the stairs instead of elevator 🪜",
  "Park farther away to walk more 🚗",
  "Drink water before every meal 💦",
  "Get 7-8 hours of quality sleep 😴",
  "30 minutes of daily exercise 🏃‍♀️",
  "Practice good posture while sitting 🪑",
  "Take a cold shower for 1 minute 🚿",

  // 🧠 Mental Health & Mindfulness
  "Practice 5-minute deep breathing exercise 🫁",
  "Write down 3 things you're grateful for 🙏",
  "Digital detox for 1 hour before bed 📴",
  "Spend 15 minutes in nature daily 🌳",
  "Listen to calming music or sounds 🎶",
  "Practice positive self-affirmations 💫",
  "Call a friend or family member 📞",
  "Do one act of kindness daily ❤️",
  "Declutter one small area of your space 🧹",
  "Watch a sunrise or sunset 🌅",

  // 📚 Learning & Personal Growth
  "Read 10 pages of a book daily 📖",
  "Learn one new word in another language 🗣️",
  "Watch one educational video daily 🎥",
  "Listen to a podcast during commute 🎧",
  "Practice a skill for 15 minutes 🎯",
  "Write in a journal for 5 minutes ✍️",
  "Review your weekly goals every Sunday 📅",
  "Try a new recipe each week 🍳",
  "Visit a museum or cultural site 🏛️",
  "Learn basic first aid skills 🏥",

  // 💼 Productivity & Work
  "Use the Pomodoro technique (25min work, 5min break) ⏰",
  "Tackle your most important task first 🎯",
  "Clean your workspace at the end of each day 🧼",
  "Set clear boundaries for work hours 🕒",
  "Take regular screen breaks 👀",
  "Review your accomplishments each Friday 📊",
  "Organize your computer files weekly 💻",
  "Practice saying 'no' to unnecessary tasks 🚫",
  "Batch similar tasks together 📦",
  "Plan your week every Sunday night 📋",

  // 🍎 Nutrition & Eating
  "Eat one extra vegetable with each meal 🥦",
  "Cook one homemade meal daily 🍲",
  "Practice mindful eating (no screens) 🍽️",
  "Drink herbal tea instead of soda 🍵",
  "Pack healthy snacks for work 🍎",
  "Try one new healthy recipe weekly 📖",
  "Eat slowly and chew thoroughly ⏳",
  "Drink a glass of water before snacks 💧",
  "Plan your meals for the week 🗓️",
  "Reduce processed food intake 🚫",

  // 💰 Financial Health
  "Track every expense for one day 💳",
  "Review your bank statements weekly 🏦",
  "Save $5 every day 🐖",
  "Cancel one unused subscription 📱",
  "Cook at home instead of eating out 🏠",
  "Wait 24 hours before non-essential purchases ⏳",
  "Learn one new financial term 💡",
  "Set up automatic savings transfer 🔄",
  "Compare prices before buying 🛒",
  "Read one personal finance article weekly 📰",

  // 🏠 Home & Environment
  "Make your bed every morning 🛏️",
  "Wash dishes immediately after eating 🍽️",
  "Declutter one surface daily 🧹",
  "Open windows for fresh air 🌬️",
  "Water your plants 🌱",
  "Put things back where they belong 🔄",
  "Clean as you cook 🧼",
  "Donate one unused item weekly 📦",
  "Make your space cozy and inviting 🏠",
  "Create a relaxing evening environment 🌙",

  // 🎨 Creativity & Hobbies
  "Draw or doodle for 10 minutes 🎨",
  "Listen to a new music genre 🎵",
  "Write a short poem or story 📝",
  "Take creative photos with your phone 📸",
  "Try a new craft or DIY project 🛠️",
  "Dance to your favorite song 💃",
  "Visit an art gallery or exhibition 🖼️",
  "Learn to play a musical instrument 🎸",
  "Cook a meal from a different culture 🌍",
  "Start a creative journal 📓",

  // 👥 Relationships & Social
  "Compliment one person daily 👍",
  "Call a family member 📞",
  "Write a thank-you note ✉️",
  "Listen actively without interrupting 👂",
  "Plan a weekly date night 💑",
  "Meet a friend for coffee ☕",
  "Join a community group or club 👥",
  "Volunteer for a cause you care about 🤝",
  "Practice empathy in conversations 💭",
  "Surprise someone with a small gift 🎁",

  // 🌍 Environmental & Community
  "Use a reusable water bottle 🍶",
  "Walk or bike instead of driving 🚲",
  "Reduce single-use plastic usage 🚫",
  "Support local businesses 🏪",
  "Learn about recycling in your area ♻️",
  "Plant a tree or garden 🌱",
  "Conserve water and electricity 💡",
  "Participate in community clean-up 🧹",
  "Donate to a local charity 💝",
  "Share knowledge with others 📚"
  ];

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;

  const chartData = [
    { name: "Completed", value: completedCount },
    { name: "Remaining", value: totalCount - completedCount },
  ];

  const COLORS = ["#3b82f6", "#d1d5db"];

  const pieLabel = (props: PieLabelRenderProps) => {
    const name = props.name;
    const percent = typeof props.percent === "number" ? props.percent : 0;
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  // Debug log
  console.log("Component render - authLoading:", authLoading, "user:", user);

  // ✅ Fetch habits for the current logged-in user
  const fetchHabits = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) return;

      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      setHabits(data || []);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setHabits([]);
    }
  };

  // ✅ Authentication functions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let authData: AuthData;
      
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        authData = data;
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        authData = data;
      }
      
      setUser(authData.user);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
  try {
    console.log("🚪 Attempting sign out...");
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      throw error;
    }
    
    // Force state updates
    setUser(null);
    setHabits([]);
    setSuggestion("");
    setName("");
    setDescription("");
    
    console.log("✅ Signed out successfully");
    
    // Optional: Force reload to ensure clean state
    // window.location.reload();
    
  } catch (error: any) {
    console.error("Sign out failed:", error);
    alert(`Sign out failed: ${error.message}`);
  }
};

  const addSuggestionAsHabit = async (suggestionText: string) => {
  try {
    console.log("🎯 Adding suggestion as habit:", suggestionText);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please sign in to add habits");
      return;
    }

    // Clean the habit name (remove emojis for cleaner name)
    const habitName = suggestionText.replace(/[^\w\s]/gi, '').trim();

    console.log("📝 Processed habit:", { habitName, suggestionText });

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name: habitName,
        description: suggestionText,
        completed: false,
      })
      .select();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      alert(`Error: ${error.message}`);
      return;
    }

    console.log("✅ Suggestion added as habit:", data);

    // Success - clear suggestion and refresh
    setSuggestion("");
    await fetchHabits(); // Wait for refresh
    
    // Show success message
    alert(`✅ "${habitName}" added to your habits!`);

  } catch (err) {
    console.error("❌ Error adding habit from suggestion:", err);
    alert("Unexpected error adding habit from suggestion");
  }
};

const fetchSuggestion = async () => {
  try {
    const randomSuggestion = habitSuggestions[
      Math.floor(Math.random() * habitSuggestions.length)
    ];
    setSuggestion(randomSuggestion);
  } catch (err) {
    console.error("Failed to fetch suggestion:", err);
    setSuggestion("Start with a 10-minute daily walk for better health! 🚶‍♀️");
  }
};

  // ✅ Fixed addHabit function with better error handling
  const addHabit = async () => {
  if (!name.trim()) {
    alert("Please enter a habit name");
    return;
  }

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please sign in to add habits");
      return;
    }

    console.log("➕ Adding habit:", { name, description, user: user.id });

    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description.trim(),
        completed: false,
      })
      .select(); // Add .select() to get the inserted data

    if (error) {
      console.error("❌ Supabase error:", error);
      alert(`Error adding habit: ${error.message}`);
      return;
    }

    console.log("✅ Habit added successfully:", data);

    // Reset form and refresh habits
    setName("");
    setDescription("");
    await fetchHabits(); // Wait for habits to refresh
    
    // Show success feedback
    console.log("🔄 Habits should be refreshed now");

  } catch (err) {
    console.error("❌ Unexpected error adding habit:", err);
    alert("Unexpected error adding habit");
  }
};

  const toggleHabit = async (id: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("habits")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) throw error;

      fetchHabits();
    } catch (err) {
      console.error("Failed to update habit:", err);
    }
  };

  const deleteHabit = async (id: number) => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    try {
      const { error } = await supabase.from("habits").delete().eq("id", id);

      if (error) throw error;

      fetchHabits();
    } catch (err) {
      console.error("Failed to delete habit:", err);
    }
  };

  // ✅ Fixed session check with better error handling
  useEffect(() => {
  let mounted = true;
  let timeoutId: NodeJS.Timeout;

  const initializeAuth = async () => {
    try {
      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.log("Auth check timeout - forcing load");
          setAuthLoading(false);
        }
      }, 5000); // 5 second timeout

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session error:", error);
        return;
      }
      
      if (mounted) {
        clearTimeout(timeoutId);
        if (session) {
          setUser(session.user);
          await fetchHabits();
        }
        setAuthLoading(false);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      if (mounted) {
        clearTimeout(timeoutId);
        setAuthLoading(false);
      }
    }
  };

  initializeAuth();

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log("Auth state changed:", event);
      if (mounted) {
        if (session) {
          setUser(session.user);
          await fetchHabits();
        } else {
          setUser(null);
          setHabits([]);
        }
        setAuthLoading(false);
      }
    }
  );

  return () => {
    mounted = false;
    clearTimeout(timeoutId);
    subscription.unsubscribe();
  };
}, []);

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header
        className={`flex justify-between items-center px-8 py-5 shadow-md transition-colors duration-700 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-blue-500">AI</span> Habit Tracker
        </h1>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <span className="text-sm">
                Welcome, {user.email}
              </span>
              <button
                onClick={signOut}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Sign Out
              </button>
            </div>
          )}
          
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${
              darkMode
                ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </header>

      <main className="flex flex-col items-center py-10 px-4">
        {!user ? (
          // Authentication Form
          <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border transition-all duration-500 ${
            darkMode 
              ? "bg-gray-800 border-gray-700" 
              : "bg-white border-gray-200"
          }`}>
            <h2 className="text-2xl font-bold text-center mb-6">
              {isSignUp ? "Create Account" : "Sign In"}
            </h2>
            
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full border focus:ring-2 rounded-lg px-4 py-3 outline-none transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"
                  }`}
                />
              </div>
              
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full border focus:ring-2 rounded-lg px-4 py-3 outline-none transition-all duration-300 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"
                  }`}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
            </form>
            
            <div className="text-center mt-4">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
              >
                {isSignUp 
                  ? "Already have an account? Sign In" 
                  : "Need an account? Sign Up"
                }
              </button>
            </div>
          </div>
        ) : (
          // Habit Management UI
          <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          className={`border focus:ring-2 rounded-lg px-4 py-2 w-64 outline-none shadow-md transition-all duration-300 placeholder-gray-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
              : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"
          }`}
          placeholder="Habit name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={`border focus:ring-2 rounded-lg px-4 py-2 w-64 outline-none shadow-md transition-all duration-300 placeholder-gray-500 ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500"
              : "bg-white border-gray-300 text-gray-900 focus:ring-blue-300"
          }`}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md"
          onClick={addHabit}
        >
          Add Habit
        </button>
        <button
  type="button"
  className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md"
  onClick={fetchSuggestion}
>
  Get Suggestion
</button>
      </div>

      {suggestion && (
        <div className="w-full sm:w-[600px] mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <span className="text-2xl mr-2">💡</span>
              <h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                Suggested Habit
              </h3>
            </div>
            <p className="text-gray-800 dark:text-gray-200 font-medium mb-6 text-lg bg-white dark:bg-gray-800 py-3 px-4 rounded-lg border">
              {suggestion}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                onClick={() => {
                  const habitName = suggestion.replace(/[^\w\s]/gi, '').trim();
                  setName(habitName);
                  setDescription(suggestion);
                  setSuggestion("");
                }}
              >
                <span>✏️</span>
                Use in Form
              </button>
              <button
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                onClick={async () => {
                  await addSuggestionAsHabit(suggestion);
                }}
              >
                <span>✅</span>
                Add Directly
              </button>
              <button
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                onClick={() => setSuggestion("")}
              >
                <span>❌</span>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

            <ul className="w-full sm:w-[600px] space-y-4">
              {habits.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No habits yet. Add one above!
                </p>
              )}
              {habits.map((habit) => (
                <li
                  key={habit.id}
                  className={`flex justify-between items-center rounded-3xl shadow-lg p-6 border transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl ${
                    habit.completed
                      ? darkMode
                        ? "bg-green-900 border-green-700"
                        : "bg-emerald-100 border-emerald-400"
                      : darkMode
                      ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                      : "bg-white border-gray-300 hover:border-blue-500"
                  }`}
                >
                  <div>
                    <h3
                      className={`text-lg sm:text-xl font-extrabold mb-1 tracking-tight ${
                        habit.completed
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : darkMode
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {habit.name}
                    </h3>
                    <p
                      className={`text-base sm:text-lg ${
                        habit.completed
                          ? "opacity-70"
                          : darkMode
                          ? "text-gray-300"
                          : "text-gray-800"
                      }`}
                    >
                      {habit.description}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-sm ${
                        habit.completed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => toggleHabit(habit.id, habit.completed)}
                    >
                      {habit.completed ? "Undo" : "Done"}
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all duration-200 shadow-sm"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {totalCount > 0 && (
              <>
                <div className="w-full sm:w-[600px] mt-8 p-4 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors duration-500">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Completed {completedCount} of {totalCount} habits 🎯
                  </span>
                  <div
                    className="relative w-full sm:w-1/2 h-4 rounded-full overflow-hidden group"
                    title={`${Math.round((completedCount / totalCount) * 100)}% completed`}
                  >
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    <div
                      className="h-4 rounded-full transition-all duration-700 ease-in-out"
                      style={{
                        width: `${(completedCount / totalCount) * 100}%`,
                        background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                      }}
                    />
                    <span className="absolute right-0 -top-6 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {Math.round((completedCount / totalCount) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-[600px] mt-8 p-6 rounded-xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Progress Overview 📊
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        label={pieLabel}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}