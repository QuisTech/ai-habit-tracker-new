# 🎯 AI Habit Tracker

A modern, full-stack habit tracking application built with Next.js, Supabase, and TypeScript. Features AI-powered habit suggestions, progress tracking, and a beautiful dark/light mode interface.

## 🛠️ Built With

- **[Next.js 15.5.4](https://nextjs.org)** - React Framework
- **[TypeScript 5.0](https://www.typescriptlang.org)** - Type Safety  
- **[Supabase](https://supabase.com)** - Backend & Database
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[Vercel](https://vercel.com)** - Deployment

<img width="1319" height="644" alt="Dark theme" src="https://github.com/user-attachments/assets/93142e04-af77-4af8-8831-f19b74c86a0d" />

<img width="1324" height="634" alt="Light theme" src="https://github.com/user-attachments/assets/c1d86e6d-641d-4702-9fbb-3a4c43465e4c" />


## ✨ Features

### 🔐 Authentication & Security
- **Multi-user support** with secure authentication
- **Row Level Security (RLS)** protecting user data
- **Secure session management** with automatic token refresh
- **Dark/Light mode** toggle with persistent preferences

### 🎯 Habit Management
- **Create, read, update, delete** habits
- **Mark habits as completed** with visual indicators
- **Progress tracking** with completion statistics
- **Beautiful habit cards** with hover effects and animations

### 🤖 AI-Powered Suggestions
- **100+ curated habit suggestions** across 10 categories:
  - 🌅 Morning Routines
  - 💪 Health & Fitness
  - 🧠 Mental Health & Mindfulness
  - 📚 Learning & Personal Growth
  - 💼 Productivity & Work
  - 🍎 Nutrition & Eating
  - 💰 Financial Health
  - 🏠 Home & Environment
  - 🎨 Creativity & Hobbies
  - 👥 Relationships & Social
  - 🌍 Environmental & Community

### 📊 Progress Analytics
- **Visual progress charts** using Recharts
- **Completion percentage** with progress bars
- **Pie chart overview** of completed vs remaining habits
- **Real-time statistics** and insights

### 🎨 User Experience
- **Responsive design** that works on all devices
- **Smooth animations** and transitions
- **Intuitive suggestion workflow** with three options:
  - ✏️ **Use in Form** - Populate form for customization
  - ✅ **Add Directly** - Instantly add to your habits
  - ❌ **Skip** - Get another suggestion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-habit-tracker.git
   cd ai-habit-tracker
Install dependencies

bash
npm install
# or
yarn install
Environment Setup
Create a .env.local file:

env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
Database Setup
Run this SQL in your Supabase SQL editor:

sql
-- Create habits table
CREATE TABLE public.habits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);
Run the development server

bash
npm run dev
# or
yarn dev
Open your browser
Navigate to http://localhost:3000

🛠️ Tech Stack
Frontend
Next.js 15 - React framework with App Router

TypeScript - Type-safe JavaScript

Tailwind CSS - Utility-first CSS framework

Lucide React - Beautiful icons

Recharts - Data visualization library

Backend & Database
Supabase - Backend-as-a-Service

Authentication

PostgreSQL Database

Row Level Security

Real-time subscriptions

Deployment
Vercel - Serverless deployment platform

Environment Variables - Secure configuration

📁 Project Structure
text
ai-habit-tracker/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main habit tracker page
│   │   ├── auth/
│   │   │   └── page.tsx      # Authentication page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   └── AuthWrapper.tsx   # Authentication wrapper
│   └── lib/
│       └── supabaseClient.ts # Supabase configuration
├── public/                   # Static assets
├── package.json
└── README.md
🔧 Configuration
Supabase Setup
Create a new project at supabase.com

Get your project URL and anon key from Settings → API

Update your environment variables

Run the database SQL provided above

Vercel Deployment
Fork this repository

Connect your GitHub repo to Vercel

Add environment variables in Vercel dashboard

Deploy automatically on git push

🎯 Usage Guide
Getting Started
Sign Up - Create a new account with email and password

Add Habits - Manually create habits or use suggestions

Track Progress - Mark habits as completed and view statistics

Using AI Suggestions
Click "Get Suggestion" to receive a random habit idea

Choose from three options:

Use in Form - Customize before adding

Add Directly - Instantly add to your list

Skip - Get another suggestion

Managing Habits
Complete - Click "Done" to mark as completed

Undo - Click "Undo" to mark as incomplete

Delete - Remove habits you no longer track

View Progress - Check completion statistics and charts

🚀 Deployment
Vercel (Recommended)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
Environment Variables for Production
Make sure these are set in your deployment platform:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

🤝 Contributing
We welcome contributions! Please see our Contributing Guide for details.

Development Setup
Fork the repository

Create a feature branch: git checkout -b feature/amazing-feature

Commit your changes: git commit -m 'Add amazing feature'

Push to the branch: git push origin feature/amazing-feature

Open a Pull Request

🐛 Troubleshooting
Common Issues
"Invalid Refresh Token" Error

bash
# Clear browser storage and refresh
localStorage.removeItem('supabase.auth.token')
sessionStorage.removeItem('supabase.auth.token')
window.location.reload()
Build Failures

Ensure all environment variables are set

Check TypeScript compilation with npm run build

Verify Supabase project is active

Database Connection Issues

Verify RLS policies are correctly set

Check Supabase project URL and API keys

Ensure database tables exist

📈 Future Enhancements
Habit streaks and consistency tracking

Reminder notifications for habits

Social features - share progress with friends

Advanced analytics - weekly/monthly reports

Habit categories and filtering

Mobile app with React Native

Integration with calendar apps

Export data to CSV/PDF

🏆 Best Practices Implemented
✅ TypeScript for type safety

✅ Row Level Security for data protection

✅ Responsive design for all devices

✅ Accessibility considerations

✅ Error handling and user feedback

✅ Performance optimization with Next.js

✅ Clean code architecture and separation of concerns

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Next.js team for the amazing framework

Supabase for the excellent backend service

Tailwind CSS for the utility-first CSS approach

Lucide for the beautiful icons

Recharts for the data visualization components

📞 Support
If you need help with this project:

Check the Troubleshooting section

Open an Issue

Contact the maintainers

Built with ❤️ using Next.js, Supabase, and TypeScript

⭐ Star this repo if you found it helpful!

text

This README provides:

- **Comprehensive feature overview**
- **Step-by-step installation guide**
- **Technical architecture details**
- **Usage instructions**
- **Deployment guides**
- **Troubleshooting section**
- **Future roadmap**


