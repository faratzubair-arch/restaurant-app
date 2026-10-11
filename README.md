# Restaurant App MVP (Full-Stack Mobile Application)

A comprehensive full-stack restaurant mobile application built with **React Native, Expo, Node.js, Express.js, and MongoDB**, featuring role-based authentication, menu browsing, cart state management, and table reservations.

---

## 👤 Student Information

* **Name:** Farat Zubair
* **Course:** Artificial Intelligence (AI)
* **Repository:** [restaurant-app-mvp](https://github.com/faratzubair-arch/restaurant-app-mvp)

---

## 🎥 Project Demonstration Video & Screen Recording Note
* **Screen Recording Link:** 👉 **[Watch & Download Project Walkthrough Video (Google Drive)](https://drive.google.com/file/d/1DSl_rUCJ0lOi5LNkvI9YeXeW1QdQF3ZI/view?usp=sharing)**
* **GitHub Size Limit Handling:** During the project upload, a heavy screen recording file (`Recording 2026-10-11 210411.mp4` exceeding 160 MB) caused a push failure due to GitHub's strict **100 MB per-file size limit**[cite: 8]. To resolve this, the video file was removed from Git tracking and history, added to `.gitignore`, and securely hosted on **Google Drive** for evaluation while keeping the repository clean and optimized.

---

## 🔑 Seeded Credentials

You can use the following default credentials to test customer and manager roles in the application:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Customer** | `customer@test.com` | `Password1` |
| **Manager** | `manager@test.com` | `Password1` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Access | Request Body | Response |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | `name, email, password` | User object & JWT token |
| **POST** | `/api/auth/login` | Public | `email, password` | User info & JWT token |

### Menu & Orders
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/menu` | Public | Fetch all available menu items |
| **POST** | `/api/orders` | Private (Customer) | Place a new food order |
| **GET** | `/api/orders` | Private (Manager) | View all restaurant orders |

### Tables & Reservations
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tables` | Private | Check available restaurant tables |
| **POST** | `/api/reservations` | Private (Customer) | Reserve a table |

---

## ❓ Project Question-by-Question (Q/Q) & Feature Breakdown

* **Q1: What is the primary objective of the Restaurant App?**
  * **Answer:** The application provides a complete full-stack mobile platform where users can browse menus, add items to a cart, reserve tables, and managers can efficiently handle restaurant operations.

* **Q2: Which technologies (Tech Stack) are used in this project?**
  * **Frontend:** React Native and Expo framework for cross-platform mobile user interfaces.
  * **Backend:** Node.js and Express.js for RESTful APIs and server-side business logic.
  * **Database:** MongoDB and Mongoose ODM for handling structured database schemas (User, MenuItem, Order, Table, Reservation).

* **Q3: How are authentication and authorization implemented?**
  * **Answer:** The system uses JSON Web Tokens (JWT) for secure role-based authentication, separating access levels and middleware restrictions between customers and managers.

* **Q4: Why was there an issue pushing the video recording to GitHub, and how was it resolved?**
  * **Answer:** GitHub enforces a strict **100 MB** file size limit, and the local recording file was approximately **161.81 MB**[cite: 8]. This was resolved by removing the file from Git tracking/history, updating the `.gitignore` configuration, and uploading the full walkthrough video to Google Drive.

---

## 📂 Repository Structure

```txt
restaurant-app-mvp/
├── server/
│   ├── config/       # Database connection (db.js)
│   ├── controllers/  # Business logic for auth, menu, orders, reservations, tables
│   ├── middleware/   # JWT authentication and role-based authorization (authMiddleware.js)
│   ├── models/       # Mongoose schemas (User, MenuItem, Table, Reservation, Order)
│   ├── routes/       # Express route definitions
│   ├── server.js     # Entry point for the backend server
│   └── seed.js       # Database seeding script
├── src/
│   ├── api/          # API client helper (client.js)
│   ├── context/      # React context providers (Auth, Cart, Theme)
│   ├── hooks/        # Custom React hooks (useApi.js)
│   └── screens/      # Customer and manager mobile screens
├── A2/               # Assignment 2 deliverables (SRS_v2.pdf, Postman collection, Screenshots)
├── .env.example      # Template for environment variables
└── README.md         # Project Documentation
🚀 Getting Setup & Configuration Instructions
1. Prerequisites
Node.js (LTS) and npm installed on your system.

MongoDB (local instance or MongoDB Atlas cloud cluster).

Expo Go app installed on your physical mobile device (or an Android/iOS emulator).

2. Clone the Repository
Open your terminal and run the following commands to clone and open the project:

Bash
git clone [https://github.com/faratzubair-arch/restaurant-app-mvp.git](https://github.com/faratzubair-arch/restaurant-app-mvp.git)
cd restaurant-app-mvp
3. Backend Setup
Install server dependencies:

Bash
npm install
Create a .env file in the root directory matching .env.example with your credentials:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
Populate the database with initial mock items and user credentials:

Bash
npm run seed
Start the backend Node.js server:

Bash
npm run server
4. Frontend (Mobile App) Setup
In a separate terminal window, install mobile dependencies:

Bash
npm install
Launch the Expo development server:

Bash
npx expo start
Scan the generated QR code using the Expo Go app on your phone to run the app live.

📋 Assignment 2 Deliverables (A2)
All documentation including the Software Requirements Specification (SRS_v2.pdf), API testing collections (Postman), and system interface screenshots are safely placed inside the A2/ folder in this repository.