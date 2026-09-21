# 😂 Prank With Friends

A fun web-based prank application that looks like a Love Calculator. Users can create their own personal prank link and share it with friends.

## 🌐 Live Website

https://soulmatecheck.universalkhabar.com/

## 📦 GitHub Repository

https://github.com/Shivchran/Prank-With-Friends

## 🚀 Features

- User Signup
- User Login
- Personal prank link generation
- Love Calculator prank interface
- Name and crush-name submission
- Fake love calculation animation
- Prank reveal screen
- User dashboard
- MongoDB data storage
- JWT authentication
- Responsive mobile and desktop UI

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

### Deployment

- GitHub
- Render
- Custom domain

## 📁 Project Structure

```text
prank-with-friends/
|
|-- frontend/
|   |
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- assets/
|   |   |-- App.jsx
|   |   `-- index.css
|   |
|   |-- index.html
|   `-- package.json
|
|-- backend/
|   |
|   |-- controllers/
|   |-- middleware/
|   |   `-- authMiddleware.js
|   |
|   |-- models/
|   |   |-- User.js
|   |   `-- Submission.js
|   |
|   |-- routes/
|   |   |-- auth.js
|   |   |-- dashboard.js
|   |   `-- submission.js
|   |
|   |-- package.json
|   `-- server.js
|
|-- .gitignore
`-- README.md
```

## 🔄 How It Works

1. User opens the website.
2. User creates an account.
3. A personal prank link is generated.
4. User shares the link with a friend.
5. Friend opens the personal link.
6. The application verifies the prank link.
7. Friend enters their name.
8. Friend enters their crush name.
9. The information is submitted to the backend.
10. The application shows a fake love calculation.
11. The prank reveal is displayed.
12. The friend is informed that they have been successfully fooled.

## 🔗 Frontend Routes

| Route | Purpose |
|---|---|
| `/` | Signup / Home |
| `/login` | User Login |
| `/dashboard` | User Dashboard |
| `/:slug` | Personal Prank Page |

## 🔌 Backend API

### Health Check

```text
GET /api/health
```

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Submission

```text
GET /api/submission/check/:slug
POST /api/submission
```

## ⚙️ Environment Variables

### Frontend

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=https://prank-with-friends.onrender.com
```

### Backend

The backend requires environment variables for:

- MongoDB connection
- JWT secret
- Server configuration

Do not upload `.env` files or passwords to GitHub.

## 💻 Run Frontend Locally

Open CMD inside the project:

```cmd
cd frontend
npm install
npm run dev
```

## 🖥️ Run Backend Locally

Open another CMD:

```cmd
cd backend
npm install
npm run dev
```

## 🏗️ Production Build

For the frontend:

```cmd
cd frontend
npm run build
```

The production files are generated inside:

```text
frontend/dist
```

## ☁️ Deployment

The project is deployed using Render.

### Frontend

https://soulmatecheck.universalkhabar.com/

### Backend API

https://prank-with-friends.onrender.com

## 🔐 Security

- `.env` files should never be committed.
- MongoDB credentials should remain private.
- JWT secrets should remain private.
- Authentication-protected routes should verify the user's token.
- Never expose database credentials in frontend code.

## 🎭 Project Purpose

Prank With Friends is an entertainment project created for fun.

The Love Calculator and compatibility calculation shown on the website are simulated for the prank experience and are not real relationship, astrology, or compatibility calculations.

## 👨‍💻 Developer

**Sachin Upmanyu**

Frontend Developer / MCA Student

LinkedIn:

https://www.linkedin.com/in/sachin-upmanyu-web-developer

---

❤️ Made for fun with React, Node.js and MongoDB.
