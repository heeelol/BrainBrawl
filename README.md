**Team Name**
- BrainBrawl

**Team Members:**
 - Yap Jia Wei
 - Lee Kuan Yi

**Installation and Setup Guide**

Follow these steps to run BrainBrawl locally:

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm (Node Package Manager)
   - Git
   - MongoDB Atlas account (or local MongoDB installation)

2. **Clone the Repository**
  
   git clone https://github.com/YourUsername/BrainBrawl.git
   
   cd BrainBrawl
   

4. **Set Up the Backend**
   
   cd brainbrawl1.0/server
   npm install

   The backend includes these key dependencies:
   - Express.js for the server framework
   - MongoDB and Mongoose for database operations
   - JWT and bcrypt for authentication
   - CORS for cross-origin resource sharing
   - cookie-parser for handling cookies
   - nodemon for development auto-reload
   
   Create a `.env` file in the server directory with your MongoDB connection string:
 
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
 

5. **Set Up the Frontend**

   cd ../client
   npm install

   The frontend includes these key dependencies:
   - Tailwind CSS for styling
   - React Hot Toast for notifications
   - HeadlessUI for UI components
   - HeroIcons for icons
   - React Router for navigation
   - Axios for API calls


6. **Run the Application**
   
   Start the backend server (from the server directory):

   npm start

   
   Start the frontend development server (from the client directory):

   npm run dev


7. **Access the Application**
   - Frontend: Open http://localhost:5173 in your browser
   - Backend API: http://localhost:3000

8. **Test Account**
   - Email: test@gmail.com
   - Password: 123456

**Troubleshooting**
- If you encounter CORS issues, ensure both frontend and backend servers are running
- For database connection issues, verify your MongoDB connection string in the `.env` file
- Make sure all required ports (3000 for backend, 5173 for frontend) are available

**Development**
- Frontend code is in `brainbrawl1.0/client/src`
- Backend API routes are in `brainbrawl1.0/server/routes`
- Database models are in `brainbrawl1.0/server/models`

**Proposed Level of Achievement**

Apollo 11 — We aim to go beyond basic features with real-time multiplayer, gamification, and user progression systems, fully deployed with complete documentation and UI polish.
	
**Aim**

BrainBrawl seeks to make studying fun by combining competitive gaming with academic quizzes. The goal is to create a platform where students revise through real-time 1v1 battles, gain XP, level up, and customize avatars, transforming boring study sessions into exciting challenges.

**Motivation**

The motivation behind this project is to make studying more engaging and exciting, so that they will learn concepts more effectively and hence be better equipped with relevant toolsets for the future. Traditional revision methods can feel monotonous, leading to procrastination. By introducing gamification, like 1v1 battles, level-ups, and interactive feedback, this app aims to encourage consistent learning habits while keeping users motivated.

**One-Sentence Scope**

A real-time quiz battle app that gamifies learning through XP, leveling, and custom avatars.

**Descriptive Scope**

BrainBrawl is a full-stack MERN web app that turns quiz-based revision into a competitive and fun experience. Players challenge others in live quiz duels, earn experience, and unlock avatar customizations. A leaderboard tracks global rankings while the integrated shop and cosmetic features keep users invested and progressing.

**User Stories**

1. As a student who wants to revise effectively, I want to participate in quizzes so that I can test and improve my knowledge.
2. As a competitive user who enjoys challenges, I want to engage in 1v1 quiz battles so that I can compete and level up.
3. As a learner who values progress tracking, I want to view my performance history and level progression to stay motivated.

**Tech Stack**

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express.js
- Database: MongoDB (hosted via MongoDB Atlas)
- Auth: JWT + bcrypt
- Version Control: Git + GitHub
- Design: Canva (posters), Draw.io (flowcharts), Figma (UI mockups)

**Core Features**

**Login & Registration (implemented ✅)**

As BrainBrawl is a personalized, gamified quiz app, each user requires a secure and unique account to track progress, XP, and unlockables.

BrainBrawl currently supports account registration and login using email and password, with secure session management. The system is designed with best practices for authentication and user safety, using industry-standard libraries and database security principles.

Using the backend authentication logic implemented in Node.js + Express, and a MySQL database, users can:

- Create an account using email and password

- Log in using valid credentials

- Receive an authentication token (JWT) to access protected features

- Interact with the dashboard only when authenticated

Upon user registration, the password is hashed securely with bcrypt before storing in the database. During login, the backend verifies the password and returns a signed JWT token, which the frontend uses to access protected routes. Input validation is performed to prevent malformed or insecure data.

The API responds with appropriate messages for invalid inputs, and all authentication-related errors are handled gracefully on both the frontend and backend.

**Quiz System with Question Pool (Basic Version implemented ✅)**

The quiz system allows users to take quizzes from a pool of questions, with various topics to choose from, providing a variety of engaging quizzes that keeps users interested.

For now, there is only one topic available, which is "General Knowledge". The quiz system is designed to be extensible, allowing for easy addition of new topics and questions in the future.

Currently, the quiz system is entirely frontend-based, with the questions and answers written down in a JavaScript file. When the quiz starts, the system retrieves the questions and their options from the JavaScript file, and the user is presented with these questions and multiple-choice answers, each question at a time. When the user selects an answer for a question, the system will check from the question data if it is correct or not. 

Once the user selects an option, the answer will be revealed instantly, and the user cannot select any other options and has to move onto the next question. If the answer is correct, the user gains 1 point, and if it is incorrect, the user does not lose or gain any points.

After the quiz ends, the user is presented with their score (the number of questions answered correctly). Then the user can exit the quiz interface and return to the dashboard.

In the future, the quiz will also use backend features, such as using the MongoDB database to store and retrieve question data, and more topics and multiplayer battles will be added. The system will also provide feedback on which questions were answered correctly or incorrectly, allowing users to learn from their mistakes.

**Real-time 1v1 Battle Mode (🔜 Milestone 2)**

**XP System, Level Progression (🔜  Milestone 2)**

**Leaderboard (🔜  Milestone 2)**

**Custom Avatars and Profiles (🔜  Milestone 3)**

**Learning Insights (🔜  Milestone 3)**

**Cosmetic Shop (🔜  Milestone 3)**

**Work Log**
- Refer to spreadsheet: https://nusu-my.sharepoint.com/:x:/r/personal/e1398391_u_nus_edu/Documents/Orbital%20Project%20Log.xlsx?d=w4f56c5a81a944623ae50481b5c01b7a7&csf=1&web=1&e=Hedxqs
