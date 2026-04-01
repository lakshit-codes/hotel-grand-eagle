# Hotel Grand Eagle - Admin Panel & Property Management System (PMS)

## 1. Project Overview
Hotel Grand Eagle is a comprehensive, modern web-based Property Management System (PMS) designed to streamline hotel operations. It provides staff and management with a centralized dashboard to manage bookings, guest profiles, room inventory, housekeeping, maintenance, and staff rosters. 

**Main Use Case & Functionality:**
- **Front Desk Operations:** Quick check-ins, check-outs, and managing walk-in guests.
- **Reservation Management:** Calendar-based interactive timeline to view and assign room bookings.
- **Guest CRM:** Track customer details, loyalty tiers, preferences, and booking history.
- **Hotel Operations:** Manage housekeeping status, log maintenance requests, and track staff shifts.
- **Reporting:** View occupancy rates, revenue breakdowns, and execute end-of-day Night Audits.

## 2. Project Architecture & Flow
The application is built as a full-stack Next.js web application utilizing the App Router paradigm.

**High-Level Architecture:**
- **Frontend (Client):** A responsive, Single Page Application (SPA)-like interface built with React and Tailwind CSS. State is managed locally within components to provide a snappy, app-like experience.
- **Backend (API Base):** Next.js API Routes (`app/api/*`) act as the backend server, handling RESTful requests from the frontend.
- **Database:** MongoDB acts as the primary data store, holding collections for bookings, customers, rooms, staff, etc.

**End-to-End Flow:**
1. **User Interaction:** A user clicks "Add Booking" on the frontend.
2. **Client State:** The React component opens a modal and captures form data.
3. **API Call:** Upon submission, a `POST` request is sent to the relevant Next.js API route (e.g., `/api/bookings`).
4. **Database Operation:** The API route validates the payload and inserts the document into MongoDB.
5. **UI Update:** The API responds with success, and the frontend state is updated immediately to reflect the new data without requiring a full page reload.

## 3. Directory & File Structure
```text
hotel-grand-eagle/
├── .env                  # Environment variables (e.g., MongoDB URI)
├── package.json          # Project metadata, scripts, and dependencies
├── app/                  # Next.js App Router root directory
│   ├── api/              # Backend REST API routes
│   │   ├── bookings/     # Booking CRUD operations
│   │   ├── customers/    # Customer CRM operations
│   │   ├── rooms/        # Room & Inventory management
│   │   └── ...           # (Other API endpoints: staff, housekeeping, etc.)
│   ├── components/       # Reusable React UI Components
│   │   ├── Bookings.tsx  # Calendar timeline and reservation management
│   │   ├── Dashboard.tsx # Main KPI dashboard and recent activities
│   │   ├── Customers.tsx # Guest directory and profiles
│   │   ├── ui.tsx        # Shared UI elements (Buttons, Inputs, Icons)
│   │   └── types.ts      # TypeScript interfaces for data models
│   ├── page.tsx          # Main application shell and routing logic
│   ├── layout.tsx        # Global HTML structure and metadata
│   └── globals.css       # Global CSS styles (Tailwind imports)
└── public/               # Static assets (images, icons)
```

## 4. Installation / Setup Instructions

**Prerequisites:**
- **Node.js:** v18.x or higher
- **MongoDB:** A local MongoDB instance or a cloud MongoDB Atlas cluster.

**Step-by-Step Setup:**
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd hotel-grand-eagle
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Open the `.env` file in the root directory (or create one) and add your MongoDB connection string.
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hotel_db
   ```
4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
5. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`.

## 5. Usage Guidelines
- **Navigation:** Use the left sidebar (or hamburger menu on mobile) to navigate between different modules (Dashboard, Bookings, Guests, Rooms, Staff).
- **Managing Bookings:** Navigate to the "Bookings" tab. Use the Calendar view to see room availability across timelines. Click on an empty slot or use the "New Booking" button to create a reservation.
- **Quick Check-in:** From the Dashboard, click "Quick Check-in" to immediately process arriving guests.
- **Housekeeping:** Staff can mark rooms as "Clean", "Dirty", or "Out of Order" from the Housekeeping tab, which immediately reflects in the Rooms availability status.
- **Mobile Usage:** The interface is fully responsive. On mobile devices, data tables allow for horizontal swiping to view off-screen columns without breaking the layout.

## 6. Dependencies
**Major Libraries & Frameworks:**
- **[Next.js](https://nextjs.org/) (v16.1):** The core React framework handling both the frontend UI and backend API routes.
- **[React](https://react.dev/) (v19):** Used for building the interactive user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/) (v4):** Utility-first CSS framework used for rapid, responsive UI styling.
- **[MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/current/) (^7.1):** Official database driver connecting the Next.js backend to the MongoDB database.
- **[TypeScript](https://www.typescriptlang.org/):** Adds static type safety across both frontend components and backend APIs.

## 7. Key Components
- **`app/page.tsx` (Main Shell):** Acts as the orchestrator. It fetches initial data from the API upon load, manages global state (like which tab is active), and renders the sidebar, top nav, and the currently selected module component.
- **`app/components/ui.tsx`:** Contains the foundational design system. It exports reusable atoms like `Btn`, `Inp`, `Badge`, and SVG icons. It also contains the core CSS architecture enforcing a mobile-first, responsive design.
- **`app/components/Bookings.tsx`:** The most complex UI component. It features a custom-built, horizontally scrolling calendar grid with a sticky "Rooms" column, accurately plotting bookings across a visual timeline based on check-in/out dates.
- **API `route.ts` handlers:** Located inside `app/api/...`, these files contain standard exported functions (`GET`, `POST`, `PUT`, `DELETE`) that interact using `mongodb` collections to parse requests and return JSON responses to the frontend.
# hotel-grand-eagle
# hotel-grand-eagle
