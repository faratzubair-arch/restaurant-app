# Restaurant App with Server and Database (A2)

Welcome to the GitHub repository for **Assignment 2: Full-Stack Restaurant App (React Native, Node.js, Express, MongoDB)**. This project upgrades the A1 mock-data mobile application into a fully functional, production-ready distributed system featuring a backend REST API server and a persistent MongoDB database.

---

## 🚀 Demo Video
Watch the full application demonstration across multiple devices:
* **[Watch A2 Demo Video (Google Drive)](https://drive.google.com/file/d/1DSl_rUCJ0lOi5LNkvI9YeXeW1QdQF3ZI/view?usp=sharing)**

---

## 📂 Repository Structure
```text
restaurant-app-mvp/
├── A2/
│   ├── SRS_v2.pdf                   # Updated Software Requirements Specification
│   ├── diagrams/                    # Sequence and Deployment diagrams
│   └── restaurant-api.postman_collection.json # Exported Postman Collection
├── server/                          # Backend Node.js & Express application
│   ├── config/                      # Database configuration (db.js)
│   ├── controllers/                 # Route controllers (auth, menu, orders, reservations)
│   ├── middleware/                  # Authentication & role-verification middleware (auth.js)
│   ├── models/                      # Mongoose schemas (User, MenuItem, Table, Reservation, Order)
│   ├── routes/                      # API endpoint routers
│   ├── server.js                    # Entry point for Express server
│   ├── seed.js                      # Database seeding script
│   ├── .env.example                 # Environment variables template
│   └── package.json                 # Backend dependencies & scripts
├── src/                             # React Native mobile application source code
│   ├── api/                         # API client helper (client.js) & custom hooks (useApi.js)
│   ├── context/                     # React Context (AuthContext, etc.)
│   ├── screens/                     # Updated screens fetching from server
│   └── ...                          # Components, reducers, and navigation
├── package.json
└── README.md
🛠️ Tech Stack & ConceptsFrontend: React Native (Expo Go), Context API, Custom Hooks, React Navigation, AsyncStorage.Backend: Node.js, Express.js, CORS, dotenv, JWT (JSON Web Tokens), Bcryptjs.Database: MongoDB (MongoDB Atlas / Community Server with Mongoose ODM).Testing & Tools: Postman / Thunder Client.⚙️ Getting Started & InstallationPrerequisitesNode.js (LTS) and npm installed on your machine.MongoDB cluster (MongoDB Atlas) or local Community Server.Expo Go app installed on your mobile device or an emulator.1. Clone the Repository & Setup BackendBashgit clone [https://github.com/your-username/restaurant-app-mvp.git](https://github.com/your-username/restaurant-app-mvp.git)
cd restaurant-app-mvp/server
2. Configure Environment VariablesCreate a .env file inside the server/ folder based on .env.example:Code snippetPORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
(Note: Do not commit your real .env file.)3. Install Dependencies and Seed DatabaseBash# Install backend dependencies
npm install

# Seed mock data into MongoDB (adds users, menu items, and tables)
npm run seed
4. Run the Development ServerBashnpm run dev
The server will start on port 5000.📱 Running the React Native Mobile AppNavigate back to the root directory and install app dependencies:Bashcd ..
npm install
Configure your API base URL in src/api/client.js:Update BASE_URL to point to your laptop's local IP address (e.g., http://192.168.1.15:5000). Ensure your phone and laptop are on the same Wi-Fi network.If using an Android Emulator, use http://10.0.2.2:5000.Start Expo:Bashnpx expo start
Scan the QR code using Expo Go on your physical mobile device or launch an emulator.🔑 Seeded Login CredentialsYou can use the following seeded accounts to test customer and manager workflows:Manager Account:Email: manager@restaurant.comPassword: password123Role: Manager (Full access to menu CRUD, order status updates, and reservation management).Customer Account:Email: customer@restaurant.comPassword: password123Role: Customer (Access to view menu, place orders, book tables, and track order statuses via polling).📋 API Endpoints ReferenceMethodEndpointAccessDescriptionPOST/api/auth/registerPublicRegister a new user accountPOST/api/auth/loginPublicAuthenticate user and return JWT tokenGET/api/menuPublicRetrieve all menu items (supports query filters for category and search)GET/api/menu/:idPublicGet a single menu item by IDPOST/api/menuProtected (Manager)Add a new menu itemPUT/api/menu/:idProtected (Manager)Update an existing menu itemDELETE/api/menu/:idProtected (Manager)Remove a menu itemPOST/api/ordersProtected (Customer)Place a new order with server-side price validationGET/api/orders/myProtected (Customer)Retrieve authenticated customer's ordersGET/api/ordersProtected (Manager)Retrieve all customer ordersPATCH/api/orders/:id/statusProtected (Manager)Update order fulfillment status (Pending ➔ Preparing ➔ Ready ➔ Served)POST/api/reservationsProtected (Customer)Book a table with server-side capacity/availability checkGET/api/reservations/myProtected (Customer)Retrieve authenticated customer's reservationsGET/api/reservationsProtected (Manager)Retrieve all table reservationsPATCH/api/reservations/:idProtected (Manager)Accept or decline a table reservation