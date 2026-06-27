# 🎯 AI Interview Coach

> **Your Personal AI Career Mentor — Practice. Improve. Succeed.**

AI Interview Coach is a full-stack web application that helps students and job seekers prepare for technical and behavioral interviews using AI. Instead of generic interview questions, the application analyzes a candidate's resume, understands their target role, conducts an adaptive mock interview, and delivers personalized feedback with actionable improvement recommendations.

Built for the **Youth Code x AI Hackathon**, the project demonstrates how AI can make interview preparation more personalized, accessible, and effective for every student.

---

## 🚀 The Problem

Many students struggle with interviews because they lack:

* Personalized interview practice
* Resume-specific feedback
* Constructive evaluation
* Affordable coaching

Traditional interview preparation is often generic, expensive, or unavailable when students need it most.

---

## 💡 Our Solution

AI Interview Coach acts as an intelligent interviewer that adapts to each candidate.

The application:

* 📄 Reads uploaded resumes (PDF/DOCX)
* 🎯 Understands the target role
* 🤖 Conducts an AI-powered mock interview
* 🧠 Generates adaptive follow-up questions
* 📊 Evaluates performance
* 📈 Creates a personalized improvement roadmap

Instead of simply asking random questions, the AI tailors the interview to each candidate's background.

---

# ✨ Features

### 📄 Resume Analysis

* Upload PDF or DOCX resumes
* Automatic text extraction
* Resume-aware interview generation

---

### 🎙️ AI Mock Interview

* Technical questions
* Behavioral questions
* HR questions
* One question at a time
* Context-aware follow-up questions

---

### 📊 Smart Evaluation

Receive detailed feedback including:

* Overall Interview Score
* Communication
* Technical Knowledge
* Problem Solving
* Confidence
* Strengths
* Weaknesses
* Personalized Learning Roadmap

---

### 🎨 Modern User Experience

* Responsive design
* Smooth animations with Framer Motion
* Clean dashboard
* Loading states
* Error handling

---

### ⚡ Developer Friendly

* OpenAI-ready
* Local fallback AI coach
* Environment variable configuration
* Production-ready build

---

# 🏗️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion

## Backend

* Node.js
* Express.js

## AI

* OpenAI API
* Resume Context Generation
* Adaptive Prompt Engineering

## File Processing

* pdf-parse
* mammoth

---

# 📂 Project Structure

```text
AI-Interview-Coach
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── hooks/
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── prompts/
│   └── uploads/
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/AI-Interview-Coach.git

cd AI-Interview-Coach
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=5000

CLIENT_ORIGIN=http://localhost:5173

OPENAI_API_KEY=your_openai_api_key

OPENAI_MODEL=gpt-4o-mini
```

Optional:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Run Development Server

```bash
npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

# 🚀 Production

```bash
npm install

npm run build

npm start
```

Express automatically serves the production React build from `client/dist`.

---

# 🎯 How It Works

1. Upload Resume
2. Select Target Role
3. AI analyzes resume
4. AI conducts adaptive interview
5. Candidate answers questions
6. AI generates evaluation
7. Personalized roadmap is created

---

# 🔮 Future Improvements

* Voice-based interviews
* AI speech analysis
* Real-time coding interviews
* Company-specific interview modes
* ATS resume optimization
* Interview history analytics
* Multi-language support

---

# 🌍 Social Impact

Every student deserves access to high-quality interview preparation, regardless of their financial background.

AI Interview Coach lowers the barrier to professional career guidance by providing personalized, always-available interview practice powered by AI.

---

# 👨‍💻 Author

**Vinay Reddy**

Information Science & Engineering Student

Built with ❤️ for the **Youth Code x AI Hackathon**
