# 🍽️ Restaurant App with Server and Database (A2)

Welcome to the GitHub repository for **Assignment 2: Full-Stack Restaurant App** built with **React Native, Node.js, Express, and MongoDB**.

This project upgrades the A1 mock-data mobile application into a fully functional, production-ready distributed system featuring a backend REST API server and a persistent MongoDB database.

---

## 🚀 Demo Video

Watch the full application demonstration across multiple devices:

👉 **[Watch A2 Demo Video (Google Drive)](https://drive.google.com/file/d/1DSl_rUCJ0lOi5LNkvI9YeXeW1QdQF3ZI/view?usp=sharing)**

---

## ✨ Features

- **Authentication:** Register and log in with JWT-based authentication and bcrypt-hashed passwords.
- **Role-based access:** Separate Customer and Manager permissions enforced by server middleware.
- **Menu management:** Customers browse and search the menu; managers add, edit, and delete items.
- **Orders:** Customers place orders with server-side price validation and track status via polling.
- **Reservations:** Customers book tables with server-side capacity and availability checks; managers accept or decline.
- **Persistent storage:** All data stored in MongoDB using Mongoose schemas.

---

## 📂 Repository Structure

```text
restaurant-app-mvp/
├── A2/
│   ├── SRS_v2.pdf                              # Updated Software Requirements Specification
│   ├── diagrams/                               # Sequence and Deployment diagrams
│   └── restaurant-api.postman_collection.json  # Exported Postman Collection
├── server/                                     # Backend Node.js & Express application
│   ├── config/                                 # Database configuration (db.js)
│   ├── controllers/                            # Route controllers (auth, menu, orders, reservations)
│   ├── middleware/                             # Authentication & role-verification middleware (auth.js)
│   ├── models/                                 # Mongoose schemas (User, MenuItem, Table, Reservation, Order)
│   ├── routes/                                 # API endpoint routers
│   ├── server.js                               # Entry point for Express server
│   ├── seed.js                                 # Database seeding script
│   ├── .env.example                            # Environment variables template
│   └── package.json                            # Backend dependencies & scripts
├── src/                                        # React Native mobile application source code
│   ├── api/                                    # API client helper (client.js) & custom hooks (useApi.js)
│   ├── context/                                # React Context (AuthContext, etc.)
│   ├── screens/                                # Updated screens fetching from server
│   └── ...                                     # Components, reducers, and navigation
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack & Concepts

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React Native (Expo Go), Context API, Custom Hooks, React Navigation, AsyncStorage |
| **Backend** | Node.js, Express.js, CORS, dotenv, JWT (JSON Web Tokens), Bcryptjs |
| **Database** | MongoDB (MongoDB Atlas / Community Server) with Mongoose ODM |
| **Testing & Tools** | Postman / Thunder Client |

---

## ⚙️ Getting Started & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS) and npm installed
- A MongoDB cluster ([MongoDB Atlas](https://www.mongodb.com/atlas)) or a local [Community Server](https://www.mongodb.com/try/download/community)
- The **Expo Go** app on your mobile device, or an emulator

### 1. Clone the Repository & Set Up the Backend

```bash
git clone https://github.com/your-username/restaurant-app-mvp.git
cd restaurant-app-mvp/server
```

### 2. Configure Environment Variables

Create a `.env` file inside the `server/` folder based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```

> ⚠️ **Note:** Do not commit your real `.env` file.

### 3. Install Dependencies and Seed the Database

```bash
# Install backend dependencies
npm install

# Seed mock data into MongoDB (adds users, menu items, and tables)
npm run seed
```

### 4. Run the Development Server

```bash
npm run dev
```

The server will start on **port 5000**.

---

## 📱 Running the React Native Mobile App

1. Navigate back to the root directory and install the app dependencies:

   ```bash
   cd ..
   npm install
   ```

2. Configure your API base URL in `src/api/client.js`. Update `BASE_URL` to point to your laptop's local IP address:

   ```js
   const BASE_URL = "http://192.168.1.15:5000";
   ```

   - Make sure your phone and laptop are on the **same Wi-Fi network**.
   - If using an **Android Emulator**, use `http://10.0.2.2:5000`.

3. Start Expo:

   ```bash
   npx expo start
   ```

4. Scan the QR code using **Expo Go** on your physical device, or launch an emulator.

---

## 🔑 Seeded Login Credentials

Use the following seeded accounts to test the customer and manager workflows:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Manager** | `manager@restaurant.com` | `password123` | Full access to menu CRUD, order status updates, and reservation management |
| **Customer** | `customer@restaurant.com` | `password123` | View menu, place orders, book tables, and track order statuses via polling |

---

## 📋 API Endpoints Reference

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and return JWT token |
| `GET` | `/api/menu` | Public | Retrieve all menu items (supports `category` and `search` query filters) |
| `GET` | `/api/menu/:id` | Public | Get a single menu item by ID |
| `POST` | `/api/menu` | Protected (Manager) | Add a new menu item |
| `PUT` | `/api/menu/:id` | Protected (Manager) | Update an existing menu item |
| `DELETE` | `/api/menu/:id` | Protected (Manager) | Remove a menu item |
| `POST` | `/api/orders` | Protected (Customer) | Place a new order with server-side price validation |
| `GET` | `/api/orders/my` | Protected (Customer) | Retrieve the authenticated customer's orders |
| `GET` | `/api/orders` | Protected (Manager) | Retrieve all customer orders |
| `PATCH` | `/api/orders/:id/status` | Protected (Manager) | Update order status (Pending ➔ Preparing ➔ Ready ➔ Served) |
| `POST` | `/api/reservations` | Protected (Customer) | Book a table with server-side capacity/availability check |
| `GET` | `/api/reservations/my` | Protected (Customer) | Retrieve the authenticated customer's reservations |
| `GET` | `/api/reservations` | Protected (Manager) | Retrieve all table reservations |
| `PATCH` | `/api/reservations/:id` | Protected (Manager) | Accept or decline a table reservation |

Protected routes require an `Authorization: Bearer <token>` header with the JWT returned from `/api/auth/login`. A ready-to-import Postman collection is available at `A2/restaurant-api.postman_collection.json`.

---

## 📄 Documentation

- **SRS:** `A2/SRS_v2.pdf`
- **Diagrams:** `A2/diagrams/` (Sequence and Deployment diagrams)
- **API Collection:** `A2/restaurant-api.postman_collection.json`

---

## 👤 Author
* **Farat Zubair** — [GitHub Profile](https://github.com/faratzubair-arch)
