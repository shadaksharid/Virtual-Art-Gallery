# 🎨 Virtual Art Gallery

A **Full-Stack Virtual Art Gallery Web Application** built with the **MERN Stack (MongoDB, Express, React, Node.js)**. This platform allows users to **explore, upload, and engage with digital artworks** in an interactive environment.

> 🔗 **Live Demo / Deployment:** *[Optional: Add link if hosted]*  
> 🗂️ **GitHub Repository:** [github.com/shadaksharid/Virtual-Art-Gallery](https://github.com/shadaksharid/Virtual-Art-Gallery)

---

## 🚀 Features

### 👥 User Features
- Secure **JWT-based Authentication (Login/Signup)**
- **Browse & Explore Artworks** gallery with dynamic rendering
- Upload your own **artworks with Cloudinary image storage**
- **Like / Unlike** artworks
- **Comment** on artworks
- Personalized user profile

### 🛠️ Admin Panel
- Manage all artworks
- View and manage registered users
- Delete any inappropriate artwork or comment

### 🧩 Additional Implementations
- **State Management with Redux**
- **Cloudinary Integration** for optimized and scalable image storage
- **Responsive UI** for mobile and desktop devices

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Cloud Services |
|----------|---------|----------|----------------|
| React.js (Hooks, Redux) | Node.js | MongoDB | Cloudinary |
| React Router | Express.js | Mongoose | JWT for Auth |

---

## 📸 Screenshots

> *Add screenshots of the homepage, gallery, admin panel, artwork details, etc.*

---

## 🗃️ Project Structure

/Virtual-Art-Gallery
│
├── client/ # React Frontend

│ ├── src/

│ ├── components/ # Reusable Components

│ ├── pages/ # Page-level Components

│ ├── redux/ # Redux Store & Slices

│ └── App.js
│
├── server/ # Express Backend

│ ├── controllers/

│ ├── models/

│ ├── routes/

│ ├── middleware/ # Auth Middleware

│ └── server.js
│
├── .env # Environment Variables

├── package.json

└── README.md


---

## ⚙️ Setup Instructions

### 🔧 Prerequisites
- Node.js
- MongoDB Atlas Account
- Cloudinary Account

### 📌 Clone & Install

```bash
git clone https://github.com/shadaksharid/Virtual-Art-Gallery.git
cd Virtual-Art-Gallery
```
🔐 Setup Backend

    Navigate to server/ and run:
```
cd server
npm install
```

Create .env file with:
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

Start Backend:
```
npm start
```

🎨 Setup Frontend
```
cd ../client
npm install
npm start
```

Frontend runs at: http://localhost:3000

Backend runs at: http://localhost:5000
