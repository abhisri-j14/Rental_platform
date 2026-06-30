# Gizzmo 🎮📷💻
**The Ultimate Electronics Rental Platform**

Gizzmo is a modern, vibrant, and fully functional electronics rental marketplace. It allows students and creatives to rent high-end tech (laptops, cameras, drones, gaming consoles) at affordable daily rates, while giving store owners a platform to list their devices and earn passive income.

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 13+ (App Router), React, vanilla CSS Modules (Neo-brutalist / Modern styling)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (Student vs. Owner)
- **Icons:** Lucide React

---

## 📂 Project Structure

The codebase is organized into two main parts: the **Frontend (Next.js)** and the **Backend (Express)**.

### 1. Frontend (`/src`)
*Built using the Next.js App Router paradigm.*

- **`/src/app`**: Contains all the pages and routes of the application.
  - `page.js`: The landing/home page.
  - `layout.js`: The root HTML layout.
  - `/category/[slug]`: Dynamic category listing and search results page.
  - `/product/[id]`: Dynamic single product details page with "Add to Cart" and "Rent Now" functionality.
  - `/compare`: A dynamic tool to compare up to 3 devices side-by-side.
  - `/checkout`: The final checkout and payment mock page.
  - `/login`: User authentication (Login/Signup).
  - `/profile`: User dashboard (View orders, edit profile).
  - `/owner`: The "Start Earning" onboarding flow for store owners to list new devices.
  
- **`/src/components/layout`**: Reusable structural components.
  - `Navbar.js`: Main top navigation with search bar and cart slide-out drawer.
  - `Sidebar.js`: Mobile navigation drawer.
  - `Footer.js`: Site footer.
  - `ClientLayout.js`: Wraps the app with the Cart Provider and global layout.

- **`/src/context`**: Global State Management.
  - `CartContext.js`: Manages the shopping cart state using React Context and `localStorage`.

### 2. Backend (`/server`)
*A RESTful Express API that connects to MongoDB.*

- **`index.js`**: The main entry point for the Express server. Handles CORS, middleware, and database connection.
- **`models.js`**: Defines the Mongoose schemas:
  - `User`: Stores user details, roles (`student` or `owner`), and authentication data.
  - `Product`: Stores device details (title, actual price, rent price, category, specs, owner reference).
  - `Order`: Stores rental transactions.
- **`/routes`**: The API endpoints.
  - `auth.js`: Handles user registration, login, and JWT token validation.
  - `products.js`: Handles fetching, searching, and creating (listing) products.
  - `orders.js`: Handles creating and fetching rental orders.
- **`seed.js`**: A utility script to populate the database with realistic test data (devices and dummy users).

---

## 🚀 How to Run Locally

Because this project has a decoupled architecture, you need to run **both** the backend server and the frontend development server simultaneously.

### Step 1: Start the Backend Server
1. Open a terminal and navigate to the project root.
2. Ensure your MongoDB instance is running locally (or provide a `MONGO_URI` in a `.env` file).
3. Run the following command:
   ```bash
   node server/index.js
   ```
   *The backend will run on `http://localhost:5000`.*

### Step 2: Start the Frontend App
1. Open a **second** terminal window in the project root.
2. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:3000`.*

### Step 3: Seed the Database (Optional)
If your database is empty or you want fresh data:
```bash
node server/seed.js
```

---

## 💡 Key Features & Workflows

1. **Role-Based Access**: 
   - **Students/Renters** can browse, search, add to cart, and checkout.
   - **Owners** get access to the `/owner` page where they can list new devices via a dynamic form.
2. **Global Cart**: Managed via Context API, the cart persists across page reloads and can be accessed from any page via the slide-out drawer.
3. **Dynamic Search & Filtering**: The Navbar search routes to `/category/all?search=query`, dynamically filtering the database results.
4. **Product Comparison**: The `/compare` route fetches category data and allows a side-by-side spec comparison of up to 3 live database items.

---
*Built with ❤️ for Gizzmo.*
