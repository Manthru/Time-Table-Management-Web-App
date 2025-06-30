# 🗓️ Time Table Management System

A full-stack web application to create, manage, and visualize academic timetables. Built using the **MERN** stack (MongoDB, Express.js, React.js, Node.js) with a focus on user roles and dynamic scheduling.

## 🚀 Features

- 🔐 Role-based authentication (Admin, Faculty, Student)
- 📅 Create and manage class timetables dynamically
- ✏️ Full CRUD for subjects, classrooms, timeslots, and faculty
- ☁️ Hosted on Render, using MongoDB Atlas for cloud storage
- ⚙️ Modular code structure and reusable components
- 💾 Persistent login using JWT tokens and session storage

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- Tailwind CSS  
- Axios

**Backend:**  
- Node.js  
- Express.js  
- MongoDB + Mongoose

**Deployment:**  
- Frontend & backend hosted on [Render](https://render.com)  
- MongoDB Atlas for cloud database

## 🔧 Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Manthru/Timetable-MERN.git
cd Timetable-MERN

# Install dependencies for client and server
cd client
npm install
cd ../server
npm install

# Create .env files for backend (server/.env)
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
PORT=5000

# Start development servers
npm run dev   # from root (concurrently runs client and server)
