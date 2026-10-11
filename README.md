Markdown# Restaurant App with Server and Database (Assignment 2) - Fall 2026

Welcome to the **Restaurant App (MVP - Phase 2)** repository! This project upgrades our previous mock-data React Native application into a fully robust, client-server architecture powered by **Node.js, Express, and MongoDB**, complete with user authentication (JWT), secure backend validation, real-time polling updates, and manager dashboards.

---

## 👥 Student Information
* **Name:** Farat Zubair
* **Course:** Artificial Intelligence (AI)
* **Repository:** `restaurant-app-mvp`

---

## 📁 Repository Structure
```text
restaurant-app-mvp/
├── server/
│   ├── config/          # Database connection (db.js)
│   ├── controllers/     # Business logic for auth, menu, orders, reservations, tables
│   ├── middleware/      # JWT authentication and role-based authorization (authMiddleware.js)
│   ├── models/          # Mongoose schemas (User, MenuItem, Table, Reservation, Order)
│   ├── routes/          # Express route definitions
│   ├── server.js        # Entry point for the backend server
│   └── seed.js          # Database seeding script
├── src/
│   ├── api/             # API client helper (client.js)
│   ├── context/         # React context providers (Auth, Cart, Theme)
│   ├── hooks/           # Custom React hooks (useApi.js)
│   └── screens/         # Customer and Manager mobile screens
├── A2/                  # Assignment 2 deliverables (SRS_v2.pdf, Postman collection, Screenshots)
├── .env.example         # Template for environment variables
└── README.md            # Project Documentation
⚙️ Getting Started & Setup Instructions1. PrerequisitesNode.js (LTS) and npm installed on your laptop.MongoDB (MongoDB Atlas cluster or local MongoDB instance with Compass).Postman or Thunder Client (for API testing).Expo Go app installed on your smartphone (or Android/iOS emulator).2. Backend Setup (server folder)Open a terminal and navigate to the server directory:Bashcd server
Install dependencies:Bashnpm install
Create a .env file in the server folder based on .env.example:Code snippetPORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
Seed the database with initial users, menu items, and tables:Bashnpm run seed
Start the development server using nodemon:Bashnpm run dev
3. Frontend Setup (src / React Native)Go back to the root folder of the project (myapp):Bashcd ..
Open src/api/client.js and set your BASE_URL to your laptop's local IP address (both laptop and phone must be on the same Wi-Fi):JavaScriptexport const BASE_URL = '[http://192.168.](http://192.168.)X.X:5000'; // Replace with your laptop IP
Install frontend dependencies and run Expo:Bashnpm install
npx expo start
Scan the QR code using the Expo Go app on your phone.🔑 Seeded Login CredentialsManager Account:Email: manager@restaurant.comPassword: manager123Customer Account:Email: customer@restaurant.comPassword: customer123📋 API Endpoints Reference TableMethodEndpointAccessRequest BodyResponsePOST/api/auth/registerPublicname, email, password, roleCreated user & tokenPOST/api/auth/loginPublicemail, passwordToken, name, email, roleGET/api/menuPublicNone (Optional: ?category=, ?search=)List of all menu itemsGET/api/menu/:idPublicNoneSingle menu item detailsPOST/api/menuProtected (Manager)name, description, price, category, imageCreated menu item (201)PUT/api/menu/:idProtected (Manager)Updated fieldsUpdated menu itemDELETE/api/menu/:idProtected (Manager)NoneSuccess messagePOST/api/ordersProtected (Customer)orderItems, tableNumberCreated order & server-calculated totalGET/api/orders/myProtected (Customer)NoneCustomer's orders listGET/api/ordersProtected (Manager)NoneAll restaurant ordersPATCH/api/orders/:id/statusProtected (Manager)status (Preparing, Ready, Served, Cancelled)Updated order statusGET/api/tablesProtectedNoneList of tables & capacitiesPOST/api/reservationsProtected (Customer)tableNumber, guests, date, timeCreated reservation requestGET/api/reservations/myProtected (Customer)NoneCustomer's reservation statusesGET/api/reservationsProtected (Manager)NoneAll table reservationsPATCH/api/reservations/:idProtected (Manager)status (Confirmed, Declined)Updated reservation status🛠️ Assignment Questions Breakdown & ImplementationQuestion 1: SRS Update & API DesignUpdated scope to include the Node.js/Express backend and MongoDB.Added 6+ new definitions (API, REST, Endpoint, Mongoose, JWT, HTTP Status Code).Defined complete database schema relationships for Users, MenuItems, Tables, Reservations, and Orders.Documented 15+ REST API endpoints and updated sequence/deployment diagrams in A2/SRS_v2.pdf.Question 2: Express Server SetupBuilt a structured Express server inside the server/ directory.Implemented GET /api/health health-check route returning status and timestamp.Configured custom 404 Route Not Found and 500 Global Error handling middleware.Question 3: MongoDB Connection & SeedingConnected Mongoose to MongoDB (restaurant_app database).Created robust schemas with validations (non-negative pricing, enum order statuses, timestamps).Written seed.js script to populate initial users, 15 menu items, and 6 restaurant tables.Question 4: Menu REST APIsImplemented full CRUD operations for menu items with category filtering and case-insensitive search queries.Handled edge cases with proper HTTP status codes (200, 201, 400, 404, 500) and invalid MongoDB Object ID error handling.Question 5: Authentication & Authorization MiddlewareImplemented secure password hashing via bcryptjs.Generated 1-day JWT tokens on login.Created custom protect and managerOnly middleware to restrict menu management and dashboard actions to authorized managers only.Question 6: React Native App IntegrationCreated centralized src/api/client.js for clean fetch requests with automatic token attachment and error handling.Connected Login, Signup, and Menu screens to live backend endpoints, leveraging AsyncStorage for session persistence.Tested cross-device synchronization between two separate devices/emulators.Question 7: Orders, Reservations & Real-time PollingServer-side total price calculations and strict status-progression validation (Pending ➡️ Preparing ➡️ Ready ➡️ Served).Table reservation availability checking and conflict prevention (returning 409 Conflict if already booked).Integrated 10-second polling (setInterval) inside OrderHistoryScreen and ReservationHistoryScreen for live customer status updates.Deliverables & Submission Checklist (A2 Folder)SRS_v2.pdf: Placed in the A2/ folder.Postman Collection: restaurant-api.postman_collection.json inside A2/.Screenshots: All required screenshots for server health, MongoDB collection, Postman requests/failures, auth testing, and cross-device price sync saved in A2/.Demo Video: Link included below for the 4-minute maximum end-to-end multi-device workflow.📺 
 ## 📺 Demonstration Video Link
* **Screen Recording:** [Watch End-to-End Multi-Device Workflow Video](https://drive.google.com/file/d/1DSl_rUCJ0lOi5LNkvI9YeXeW1QdQF3ZI/view?usp=sharing)