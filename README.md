# FundyWise 💰

FundyWise is a high-performance, mobile-first group expense-sharing and debt-simplification application (inspired by Splitwise). The project features a hybrid architecture combining a cross-platform **React Native (Expo)** mobile application, a high-productivity **FastAPI (Python)** backend, a **PostgreSQL** database (hosted on **Supabase**), and a high-performance **C++ Core Debt Optimization engine** bound to Python using **Pybind11**.

This repository is designed to demonstrate modern software engineering principles, including cross-language integration, efficient algorithmic design, database trigger synchronization, and clean RESTful API design.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend (Mobile)** | React Native, Expo, TypeScript, React Navigation | Cross-platform UI, native performance, responsive design. |
| **Authentication** | Supabase Auth (Email/Password, JWT) | Secure user registration, session persistence, and login. |
| **Backend API** | FastAPI (Python 3.10+), Uvicorn | High-performance asynchronous REST endpoints, automatic OpenAPI docs. |
| **Database ORM** | SQLAlchemy (2.x), PostgreSQL | Structured schema definition, connection pooling, and object-relational mapping. |
| **Algorithmic Core** | C++17, Pybind11, CMake | Low-level, high-efficiency memory handling and execution of the debt-simplification heuristic. |
| **Hosting & Cloud** | Supabase (DB & Auth), Render (API) | Managed cloud infrastructure, database hosting, and serverless compute. |

---

## 🏗️ System Architecture & Data Flow

FundyWise operates on a split-plane architecture: the web-facing REST APIs and data management are handled in Python, while core compute-intensive transactions are delegated to compiled C++ machine code.

```mermaid
graph TD
    subgraph Client-Side (React Native + Expo)
        A[Mobile App UI] -->|Auth Requests| B[Supabase SDK]
        A -->|REST API Requests| C[Axios HTTP Client]
    end

    subgraph Auth Provider
        B -->|Auth Operations| D[Supabase Auth Service]
    end

    subgraph Backend Server (FastAPI on Render)
        C -->|HTTP API calls| E[FastAPI Routers]
        E -->|Business Logic| F[Services Layer]
        F -->|Pybind11 Bridge| G[Python Binding Wrapper]
        G -->|Optimize Debts| H[C++ Core Optimizer]
    end

    subgraph Database Layer
        F -->|SQLAlchemy ORM| I[(PostgreSQL - Supabase DB)]
        D -->|SQL Trigger Sync| I
    end
```

### 1. User Registration & Sync Flow
1. The user registers via the mobile app using the **Supabase SDK**.
2. **Supabase Auth** creates a record in the secure, internal `auth.users` table and issues a JWT session token.
3. A PostgreSQL **Database Trigger** (`on_auth_user_created`) in the database automatically intercepts the insert and mirrors the record (UUID, email, username, full_name) to the `public.users` table.
4. Subsequent user detail lookups can now be successfully queried via the FastAPI backend using the user's Auth UUID.

### 2. Request-Response Flow (Adding an Expense)
1. **POST /expenses** is triggered by the mobile client with the transaction payload (group, payer, total amount, and individual share breakdown).
2. The FastAPI backend validates the inputs using **Pydantic** schemas.
3. The server uses **SQLAlchemy** to start a transaction, inserts a record into the `expenses` table, inserts the corresponding breakdown into the `expense_participants` table, and commits it.
4. The database returns the newly created expense object, which is serialized and returned to the client as a JSON response.

### 3. Settlement Calculation Flow
1. **GET /groups/{group_id}/settlements** is requested by the client.
2. The service queries all expenses and participant shares for that group from PostgreSQL.
3. The raw DB models are serialized into a list of nested dictionaries inside Python.
4. The Python service invokes the C++ core via the `debt_optimizer` binary wrapper.
5. **Pybind11** converts the Python dictionaries into C++ structs (`Expense` and `ParticipantShare`).
6. The C++ function calculates the net balance for each user and runs a greedy max-heap algorithm to minimize the transaction count.
7. C++ returns the minimized transaction list, which is marshalled back into a Python list and returned to the client.

---

# 📚 Interview Prep: Technical Q&A (75 Questions)

---

## 📌 Part 1: Project Overview & Business Logic (Q1 - Q7)

### Q1: What is FundyWise, and what is the primary problem it solves?
> **Answer:**
> * **Core Concept:** FundyWise is a collaborative ledger app for tracking group expenses and simplifying payouts. It ensures that roommates, travel groups, or friends don't have to keep sending tiny individual payments back and forth to settle up.
> * **How it works:**
>   1. Users log their shared expenses (e.g., "A paid $90 for dinner split among A, B, and C").
>   2. The app aggregates all the logs within a group.
>   3. Instead of calculating peer-to-peer transfers manually, the app computes a simplified payment plan (e.g., instead of A paying B and B paying C, A pays C directly).
> * **Why this is valuable:** It removes math overhead, minimizes transfer fees, and saves time by reducing the number of final transactions needed to clear all debts.

### Q2: How is FundyWise different from a generic personal finance app like Mint or YNAB?
> **Answer:**
> * **Core Concept:** Generic personal finance apps are built for *individual budgeting*, whereas FundyWise is built for *multi-user shared ledgers*.
> * **Key Differences:**
>   - **Target Audience:** Personal budgeting apps are private (only one user sees their bank links and income). FundyWise is public and collaborative (multiple users log data to the same group).
>   - **Feature Set:** Apps like Mint track individual categories (groceries, utilities) to show your net worth. FundyWise tracks the *balances owed between people* and calculates cash-flow settlements.
>   - **Core Logic:** Budgeting apps rely on transaction classification. FundyWise relies on a graph-simplification algorithm to settle group debts.

### Q3: What is the business value of the "simplify debts" feature in real-world applications?
> **Answer:**
> * **Core Concept:** The "Simplify Debts" feature saves users time and transaction fees.
> * **Detailed Breakdown:**
>   - **Transaction Cost Reduction:** Many payment gateways (like PayPal or international banks) charge flat or percentage fees per transaction. Fewer transactions directly mean less money wasted on fees.
>   - **Social Friction Reduction:** Sending money can be awkward. Settling in a single payment instead of four separate ones makes the app much friendlier to use.
>   - **Operational Overhead:** From a system perspective, it reduces database updates and payment API calls, saving infrastructure costs.

### Q4: Who are the target user personas for FundyWise, and how does that influence the product design?
> **Answer:**
> * **Core Concept:** The app targets three primary active groups: Roommates, Travelers, and Event Organizers.
> * **How personas shape design:**
>   - **Roommates (Long-term tracking):** They need persistent groups, recurring expenses, and easy monthly summaries.
>   - **Travelers (Short-term high activity):** They need fast mobile logging on-the-go, offline capabilities, and instant settlements at the end of the trip.
>   - **Event Organizers (One-off large groups):** They need to add members quickly (e.g., via a invite link/username) and split bills in uneven proportions.
> * **Design outcome:** The UI defaults to simple layouts, avoiding financial jargon, prioritizing speed, and rendering a clear "who owes what" screen.

### Q5: How would you explain the value proposition of FundyWise to a non-technical stakeholder?
> **Answer:**
> * **Core Concept:** Focus on simplicity and the core problem solved.
> * **Stakeholder Explanation:**
>   - "Imagine going on a weekend trip with 5 friends. Throughout the trip, different people pay for gas, Airbnb, and meals. At the end, doing the math to figure out who owes who is a headache. You end up with 10 different Venmo transfers.
>   - FundyWise solves this. Everyone simply enters what they paid. At the end, our system calculates the absolute cleanest way to square up. It tells the group: 'A pay D $50, B pay E $30, and everyone is settled.' We reduce the transaction count by up to 70%, saving time and transaction fees."

### Q6: If you were to commercialize FundyWise, what monetization strategies would you implement?
> **Answer:**
> * **Core Concept:** Implement a freemium model with value-added financial integrations.
> * **Monetization Models:**
>   - **In-App Payment Fees:** Integrate Stripe or Venmo directly in the app. Charge a tiny convenience fee (e.g., 1.5% or a flat $0.25) when users choose to instantly settle up inside the app instead of manually marking it.
>   - **Premium Subscription (Freemium):** Offer a monthly subscription for power users. Pro features would include multi-currency conversion, automated receipt scanning (OCR), and exporting group logs to PDF/Excel.
>   - **Corporate Partner Portal:** White-label the split engine for corporate retreats or travel agencies to track and reconcile travel expenses.

### Q7: What are the key functional limitations of the current MVP, and what features would you prioritize next?
> **Answer:**
> * **Core Concept:** The MVP is a functional prototype that tracks simple splits, but lacks integrations and advanced split logic.
> * **Key Limitations:**
>   - **Equal Splits Only:** Shares must be calculated manually on the client side; the backend accepts a raw amount rather than doing percentage splits.
>   - **No Payment Gateway:** Settlements are only records; users must transfer money externally.
>   - **No Media Support:** Users cannot upload photos of receipts.
> * **Future Roadmap:**
>   1. Add percentage and share-based splits in the UI/API.
>   2. Implement OCR receipt scanning using a cloud vision API.
>   3. Add a payment gateway integration (like Stripe Connect) to allow direct payments.

---

## 📌 Part 2: Mobile App Architecture (React Native & Expo) (Q8 - Q17)

### Q8: Why did you choose Expo over bare React Native? What are the trade-offs?
> **Answer:**
> * **Core Concept:** Expo was chosen to speed up development and deployment, with the trade-off of less low-level native control.
> * **Why Expo:**
>   - **Fast Development:** Expo abstracts Xcode and Android Studio. We don't need to touch Swift or Kotlin code.
>   - **EAS Build and Updates:** Expo Application Services makes compiling binaries and deploying over-the-air (OTA) updates simple.
>   - **Expo Go:** Allows scanning a QR code to run and test the app on physical devices instantly.
> * **Trade-offs:**
>   - **Bundle Size:** Expo builds include many SDK libraries by default, making the initial app file slightly larger.
>   - **Native Module Constraints:** If we need a custom native C++ or Bluetooth library not supported by Expo's SDK, we have to run `npx expo prebuild` to eject to a bare project, increasing maintenance.

### Q9: Explain how routing and navigation are structured in the mobile app.
> **Answer:**
> * **Core Concept:** We use **React Navigation** (specifically Stack Navigation) divided into two conditional flows based on the authentication state.
> * **Structural Breakdown:**
>   - **Authentication State Monitor:** The root `App.tsx` listens to the user session. It renders a spinner while loading.
>   - **Logged Out Flow (`AuthNavigator`):** Renders a Stack containing `LoginScreen` and `RegisterScreen`.
>   - **Logged In Flow (`AppNavigator`):** Renders a Stack containing our main features: `HomeScreen` -> `GroupsListScreen` -> `GroupDetailsScreen` -> `AddExpenseScreen` / `SettlementScreen`.
> * **Why this is good:** Users cannot access feature screens if they are logged out. If the session expires or they click "Logout", React Navigation immediately resets the stack and redirects them to the login screen.

### Q10: How does the app maintain the login session of a user across app restarts?
> **Answer:**
> * **Core Concept:** It uses the Supabase Auth state listener coupled with local storage.
> * **Step-by-Step Flow:**
>   1. **Initialization:** When the app starts, the Supabase client checks **`AsyncStorage`** for a saved session token (JWT).
>   2. **Validation:** If found, the SDK reads the token's expiry. If it's valid, it restores the session. If it's expired, it uses a saved `refresh_token` to request a new session from Supabase in the background.
>   3. **State Update:** The `onAuthStateChange` listener in `App.tsx` catches this event, updates the React state variable `hasSession` to `true`, and routes the user directly to the Home screen.

### Q11: How do you handle form state management and input validation in screens like `AddExpenseScreen`?
> **Answer:**
> * **Core Concept:** We use local component state (`useState`) to store form inputs and perform structural validation before making API calls.
> * **Step-by-Step Validation:**
>   1. **State Hooks:** We bind inputs (like Description, Total Amount, selected Payer, and Participant Shares) to React state variables.
>   2. **Input Checks:** When the user clicks "Save", we check:
>      - Is the description text empty?
>      - Is the total amount a valid number greater than zero?
>      - Did the user select at least one person to split with?
>   3. **Precision Check:** We ensure the sum of individual participant shares matches the total amount (e.g., $10 split among 3 people must add up to exactly $10.00).
>   4. **Error UX:** If any checks fail, we show a native alert (`Alert.alert`) and halt the API request.

### Q12: Why did you choose Axios over the native Fetch API for HTTP requests?
> **Answer:**
> * **Core Concept:** Axios provides a cleaner, more robust API developer experience than the native Fetch API.
> * **Key Reasons:**
>   - **Automatic JSON Parsing:** Axios automatically parses response data from JSON. Fetch requires a manual `response.json()` call.
>   - **Centralized Instance:** We create a single `api` instance in `services/api.ts` with a pre-configured `baseURL` and default headers.
>   - **Interceptors:** Axios supports interceptors. We can write a single function that intercepts every outgoing request to inject the Supabase JWT token, and intercepts 401 Unauthorized responses to redirect the user to login.
>   - **Clean Error Handling:** Axios automatically throws errors for non-2xx status codes (like 400 or 500). Fetch succeeds even on 500 errors, requiring developers to check `response.ok` manually.

### Q13: How does React Native translate JavaScript components into native views?
> **Answer:**
> * **Core Concept:** React Native runs JavaScript in a background engine (like Hermes) and translates your UI components into real native platform views (like `UIView` on iOS and `android.view` on Android).
> * **How the architecture handles this:**
>   - **UI Thread:** The platform thread that renders native widgets.
>   - **JS Thread:** The thread running the React/JavaScript code.
>   - **The Bridge / JSI:** Historically, the JS thread serialized UI instructions as JSON packets and sent them over an asynchronous bridge to the native thread.
>   - **Modern Architecture (JSI):** Today, React Native uses **JavaScript Interface (JSI)**. JS can call native methods directly in C++ without serializing data to JSON. This allows synchronous rendering and faster performance.

### Q14: What is the role of `AsyncStorage` in the current mobile architecture?
> **Answer:**
> * **Core Concept:** `AsyncStorage` acts as a basic, unencrypted local key-value store.
> * **Use Case:**
>   - In our app, its primary role is to persist the Supabase authentication credentials (access tokens and refresh tokens) on the device.
>   - Because it is unencrypted and slow (asynchronous I/O), we do not use it for caching large lists of transaction data or storing sensitive financial secrets.

### Q15: How do you handle theme styling and responsive layouts for different screen sizes in React Native?
> **Answer:**
> * **Core Concept:** We use React Native's `StyleSheet` built-in styles, relying on Flexbox layouts and dynamic dimensions.
> * **Styling Strategies:**
>   - **Flexbox by Default:** Unlike web CSS, React Native layouts default to Flexbox with a column direction. We use properties like `flex: 1`, `justifyContent`, and `alignItems` to build fluid layouts.
>   - **Dynamic Sizing:** For sizing components based on screen width/height, we import `Dimensions` from React Native (e.g., `const { width } = Dimensions.get('window')`) to compute layouts dynamically.
>   - **Safe Areas:** We use `SafeAreaView` to prevent UI elements from being hidden behind notches, status bars, or home indicator areas.

### Q16: How would you implement push notifications to alert users when they are added to a group or when a group is settled?
> **Answer:**
> * **Core Concept:** Use Expo's notification service combined with a backend trigger.
> * **Implementation steps:**
>   1. **Request Permission:** On app start, ask the user for notification permissions using `expo-notifications`.
>   2. **Save Push Token:** Fetch the unique device token (e.g., `ExponentPushToken[...]`) and send it to our FastAPI backend to store in the `users` table.
>   3. **Backend Trigger:** When an action occurs (like another user clicking "Settle Group"), the FastAPI backend queries the database for group members' tokens.
>   4. **Send Notification:** The backend sends a POST request to Expo's push service API (`https://exp.host/--/api/v2/push/send`). Expo handles routing the message to Apple APNs or Google Firebase Cloud Messaging (FCM).

### Q17: What performance optimization techniques would you apply to render large lists of expenses smoothly in React Native?
> **Answer:**
> * **Core Concept:** Use virtualized lists to save memory and avoid rendering off-screen elements.
> * **Optimization Techniques:**
>   - **Use FlatList:** Always use `FlatList` instead of wrapping items inside a standard `ScrollView`. `FlatList` renders list items lazily as they scroll into view and unmounts off-screen elements.
>   - **Optimize Render Item:** Keep the `renderItem` component simple. Avoid declaring functions or inline objects inside it to prevent garbage collection overhead.
>   - **Use Memoization:** Wrap individual list item components in `React.memo` so they only re-render if their data properties actually change.
>   - **Implement Pagination:** Modify the backend API to support paginated queries (e.g., fetching 20 expenses at a time using offset/limit) and load more items as the user scrolls.

---

## 📌 Part 3: API Layer (FastAPI & Python) (Q18 - Q27)

### Q18: Why FastAPI instead of Django or Flask for the backend?
> **Answer:**
> * **Core Concept:** FastAPI provides high performance, modern Python asynchronous support, and fast development features.
> * **Key Reasons:**
>   - **Performance:** It is built on ASGI (Starlette) and Pydantic, making it one of the fastest Python frameworks available, approaching Go or Node.js speeds.
>   - **Asynchronous Support:** It natively supports `async/await`, letting the server handle multiple network requests (like database queries) concurrently without blocking.
>   - **Automatic Validation & Typing:** By using Python type hints, FastAPI automatically validates incoming request data and returns detailed validation errors.
>   - **Interactive Docs:** Generates Swagger API documentation automatically, making it easy to test endpoints.

### Q19: What is ASGI (Asynchronous Server Gateway Interface), and how does FastAPI leverage it?
> **Answer:**
> * **Core Concept:** ASGI is a modern standard for Python web servers that supports asynchronous communication.
> * **How it works:**
>   - **WSGI vs ASGI:** Traditional WSGI servers (like Flask/Django) handle requests synchronously—one thread per request. If a request is waiting on the database, the thread sits idle.
>   - **Asynchronous Processing:** ASGI allows a single thread to handle thousands of concurrent connections. While waiting for a database response, the thread can temporarily yield control to process other incoming requests.
>   - **FastAPI Integration:** FastAPI is built directly on Starlette (an ASGI framework), allowing it to handle concurrent API calls and real-time connections (like WebSockets) efficiently.

### Q20: Explain the role of Pydantic in FastAPI. How does it help with request validation and serialization?
> **Answer:**
> * **Core Concept:** Pydantic is a data validation library that acts as the data gatekeeper for our API.
> * **How it works:**
>   - **Input Validation (Parsing):** We define request schemas (like `ExpenseCreate`) with type annotations. When a client sends a JSON body, Pydantic parses and validates the fields. If a field is missing or has the wrong type, Pydantic rejects it and returns a `422 Unprocessable Entity` response.
>   - **Output Serialization (Formatting):** We define response schemas (like `ExpenseResponse`). Pydantic reads database objects returned by SQLAlchemy, filters out internal fields, formats dates, and serializes the clean data into JSON.

### Q21: How does FastAPI automatically generate interactive API documentation (Swagger UI)?
> **Answer:**
> * **Core Concept:** FastAPI parses your python code structure and generates a standard OpenAPI schema.
> * **How it works:**
>   - **Schema Extraction:** During startup, FastAPI inspects all route definitions, path variables, query parameters, and Pydantic schemas.
>   - **OpenAPI Document:** It generates a structured JSON file that complies with the OpenAPI specification.
>   - **UI Rendering:** FastAPI hosts built-in static pages at `/docs` (using Swagger UI) and `/redoc` (using ReDoc). These interactive pages load the JSON schema to let developers test the endpoints directly from the browser.

### Q22: How are CORS (Cross-Origin Resource Sharing) policies configured in this FastAPI application, and why is this necessary?
> **Answer:**
> * **Core Concept:** CORS is a browser security feature that restricts web apps from making requests to a different domain.
> * **How it works:**
>   - **Security Restriction:** By default, browsers prevent scripts on one origin (e.g., your local mobile dev app or web host) from reading data from another origin (our FastAPI backend hosted on Render).
>   - **FastAPI Configuration:** We add `CORSMiddleware` in `main.py` and specify allowed origins (like `*` for public access, or specific URLs). The server then includes CORS headers in its responses, letting the browser know it is safe to allow the requests.

### Q23: Explain how error handling and status codes are managed globally in your backend.
> **Answer:**
> * **Core Concept:** We use structured HTTP exceptions and global handlers to return clean error responses.
> * **How it works:**
>   - **Standard Exceptions:** We use FastAPI's `HTTPException` class (e.g., `raise HTTPException(status_code=404, detail="Group not found")`). This stops execution and returns the specified HTTP status code and a JSON response.
>   - **Global Handlers:** We can write global handlers using `@app.exception_handler()`. For example, if a database connection fails, a global handler can catch the database error, log it privately, and return a clean `500 Internal Server Error` response instead of exposing raw SQL errors.

### Q24: What is the benefit of separating API routes into modular routers (e.g., `groups_router`, `expenses_router`)?
> **Answer:**
> * **Core Concept:** It keeps the codebase clean, organized, and maintainable.
> * **Key Benefits:**
>   - **Avoid Monolithic Files:** It prevents `main.py` from growing into a massive file with hundreds of lines.
>   - **Separation of Concerns:** Each router file contains endpoints related to a single business concept (e.g., `users.py` handles users, `groups.py` handles groups).
>   - **Independent Configuration:** We can configure prefixes (e.g., `/groups`) and tags globally on a router before registering it in `main.py` using `app.include_router()`.

### Q25: How do you handle environment configurations between local development and the Render production server?
> **Answer:**
> * **Core Concept:** We separate environment configurations from code using environment variables.
> * **How it works:**
>   - **Local Development:** We use a `.env` file containing variables like `DATABASE_URL` and `SUPABASE_URL`. This file is loaded by the backend using `python-dotenv`. We add `.env` to `.gitignore` to keep credentials secure.
>   - **Production (Render):** We configure environment variables directly in the Render dashboard. When the app runs on Render, the OS injects these variables directly into the process memory, overriding any local files.

### Q26: How would you implement rate limiting in FastAPI to protect your API endpoints from abuse?
> **Answer:**
> * **Core Concept:** Implement a rate limiter to restrict the number of requests a user can make within a time window.
> * **How to implement it:**
>   - **Use Slowapi:** We can integrate the `slowapi` library, which is a FastAPI port of Flask-Limiter.
>   - **Add Limits:** We define a rate limit rule on our endpoints (e.g., limit user registration to 5 requests per minute using `@limiter.limit("5/minute")`).
>   - **Storage Backend:** Slowapi tracks requests using a fast in-memory store or an external database (like Redis) by identifying clients via their IP address or API token.

### Q27: How does the `uvicorn` web server interact with your FastAPI application?
> **Answer:**
> * **Core Concept:** Uvicorn acts as the entrypoint for HTTP requests, forwarding them to our FastAPI app.
> * **The Process:**
>   1. **Listen:** Uvicorn runs as a background process listening on a specific network port (e.g., `8000`).
>   2. **Receive & Parse:** When a client sends a request, Uvicorn receives the raw TCP packets, parses them into HTTP request data, and packages it into an ASGI-compliant format.
>   3. **Forward:** Uvicorn invokes the FastAPI application, passing the parsed request details.
>   4. **Respond:** FastAPI processes the request, generates a response, and hands it back to Uvicorn, which sends it back to the client.

---

## 📌 Part 4: Database Design & ORM (PostgreSQL & SQLAlchemy) (Q28 - Q37)

### Q28: Explain the difference between eager loading and lazy loading in SQLAlchemy, and how it impacts database performance.
> **Answer:**
> * **Core Concept:** Eager loading fetches related data in a single SQL query, while lazy loading makes separate queries as needed.
> * **Detailed Breakdown:**
>   - **Lazy Loading (Default):** When you query a group (e.g., `group = db.query(Group).first()`), SQLAlchemy only fetches the group's table columns. If you later loop through the group's members (`for member in group.members:`), SQLAlchemy runs a *new* SQL query to fetch the members. This can lead to the **N+1 query problem**, causing slow database performance.
>   - **Eager Loading:** We instruct SQLAlchemy to fetch related tables upfront using SQL `JOIN` statements (e.g., using `joinedload`). This runs a single query containing all the data, reducing database roundtrips.

### Q29: Why did you choose PostgreSQL over a NoSQL database like MongoDB for this application?
> **Answer:**
> * **Core Concept:** PostgreSQL was chosen because financial transaction applications require strict data integrity and ACID guarantees.
> * **Why SQL over NoSQL here:**
>   - **Relational Structure:** Our data is relational (users belong to groups, expenses map to participants). SQL databases handle these relationships using foreign keys.
>   - **Data Consistency:** PostgreSQL guarantees ACID transactions. If we insert an expense but the server crashes before writing the participant shares, the database rolls back the transaction. This prevents data inconsistency.
>   - **Referential Constraints:** PostgreSQL prevents invalid operations, like deleting a user who still owes money in a group.

### Q30: What indexes would you create on the database tables to optimize performance as the data grows?
> **Answer:**
> * **Core Concept:** Indexes act like a book index, allowing database engines to locate rows quickly without scanning entire tables.
> * **Key Indexes for FundyWise:**
>   - **`expenses(group_id)`**: We frequently load expenses on a per-group basis. Without this index, PostgreSQL would scan every row in the `expenses` table to find items for a specific group.
>   - **`group_members(group_id, user_id)`**: A unique composite index that speeds up group membership checks and prevents adding duplicate members.
>   - **`expense_participants(expense_id)`**: Speeds up queries that calculate individual shares for a specific expense.

### Q31: How does SQLAlchemy handle connection pooling, and why is it important for web applications?
> **Answer:**
> * **Core Concept:** Connection pooling maintains a pool of active database connections to reuse, rather than opening a new connection for every request.
> * **How it works:**
>   - **Network Cost:** Opening a database connection requires a network handshake, which takes time.
>   - **Connection Pool:** When the server starts, SQLAlchemy opens a set number of database connections (e.g., 5 or 10) and keeps them in a pool.
>   - **Reuse:** When a request arrives, SQLAlchemy assigns it an active connection from the pool. Once the request completes, the connection is returned to the pool instead of being closed.

### Q32: What is the purpose of database migrations (like Alembic), and how would you set them up for this schema?
> **Answer:**
> * **Core Concept:** Alembic acts as version control for database schemas, allowing us to safely modify tables without losing existing data.
> * **How it works:**
>   - **Tracking Changes:** If we add a new column to a table (e.g., `category` in `expenses`), we don't want to drop the production database.
>   - **Migration Scripts:** Alembic compares our SQLAlchemy Python models to the database schema and generates a migration script.
>   - **Applying Upgrades:** Running `alembic upgrade head` runs the SQL commands to update the database schema, keeping our code models and database structure in sync.

### Q33: How does the many-to-many relationship between Users and Groups function under the hood in PostgreSQL?
> **Answer:**
> * **Core Concept:** PostgreSQL handles many-to-many relationships using an intermediary table (often called a junction or join table).
> * **Junction Table Mechanics:**
>   - A User can belong to many Groups, and a Group can contain many Users.
>   - We use the **`group_members`** join table. This table contains two foreign keys: `user_id` (pointing to `users.id`) and `group_id` (pointing to `groups.id`).
>   - **Queries:** To find all members of a group, we perform an `INNER JOIN` of the `users` and `group_members` tables on the matching `user_id`, filtered by the target `group_id`.

### Q34: What is referential integrity, and how do cascading deletes work in your schema when a Group is deleted?
> **Answer:**
> * **Core Concept:** Referential integrity ensures that database relationships remain consistent (no broken pointers). Cascading deletes clean up associated data automatically.
> * **How it works:**
>   - **The Problem:** If we delete a group, what happens to the expenses and member records that point to its `group_id`? They become orphaned, violating database integrity.
>   - **Cascading Deletes:** We define foreign key constraints with `ondelete="CASCADE"`. When a Group is deleted, PostgreSQL automatically deletes all rows in the `expenses` and `group_members` tables that reference its `group_id`, keeping our data clean.

### Q35: How would you design a database schema to support multiple currencies in the same group?
> **Answer:**
> * **Core Concept:** Add currency codes and exchange rate tracking to the expenses schema.
> * **Implementation Steps:**
>   1. **`groups` Table:** Add a `default_currency` column (e.g., 'USD').
>   2. **`expenses` Table:** Add a `currency` column (e.g., 'EUR') and an `exchange_rate` column (representing the rate to the base group currency at the time the expense was logged).
>   3. **Calculations:** When running settlements, we convert all foreign currency amounts to the group's default currency using their stored exchange rates, ensuring we calculate balances in a single currency.

### Q36: What is a database transaction, and how does SQLAlchemy's `db.commit()` ensure ACID properties?
> **Answer:**
> * **Core Concept:** A transaction is a group of database operations executed as a single unit. `db.commit()` saves these changes permanently.
> * **ACID Guarantees:**
>   - **Atomicity:** Either all writes (e.g., creating an expense and its participant shares) succeed, or they are all rolled back.
>   - **Consistency:** The database ensures all table constraints are met.
>   - **Isolation:** Concurrent transactions cannot see each other's uncommitted data.
>   - **Durability:** Once committed, changes are written to disk and will not be lost even if the system crashes.

### Q37: Explain the difference between SQLAlchemy's Declarative Base (in SQLAlchemy 2.0) and the older declarative system.
> **Answer:**
> * **Core Concept:** SQLAlchemy 2.0 uses Python's PEP 484 type annotations, making the codebase safer and easier to maintain.
> * **Key Differences:**
>   - **Older System:** Defined columns using `Column(String)` or `Column(Integer)`. These are evaluated at runtime, making it easy for type errors to slip past code editors and linters.
>   - **SQLAlchemy 2.0:** Uses `Mapped[str]` and `mapped_column(String)`. Static analysis tools (like mypy) and IDEs can read these annotations to autocomplete properties and flag type mismatches before the code runs.

---

## 📌 Part 5: Core Debt Optimization Algorithm & Data Structures (Q38 - Q47)

### Q38: Explain the greedy strategy used in `debt_optimizer.cpp` to solve the debt-simplification problem.
> **Answer:**
> * **Core Concept:** The greedy strategy matches the largest creditor with the largest debtor at each step.
> * **Step-by-Step Flow:**
>   1. **Calculate Balances:** Find each user's net balance (what they paid minus what they owe).
>   2. **Build Groups:** Put positive balances in a `creditors` list and negative balances in a `debtors` list.
>   3. **Match Extremes:** Find the user who is owed the most money (top creditor) and the user who owes the most money (top debtor).
>   4. **Settle:** Calculate the transaction amount: `settled_amount = min(debtor_owes, creditor_receives)`.
>   5. **Record Transaction:** Create a transaction (debtor pays creditor).
>   6. **Update & Repeat:** Subtract the settled amount from both balances. If either user still has an outstanding balance, put them back in the queue and repeat until everyone is settled.

### Q39: What is the "Minimum Cash Flow" problem, and how does it relate to the Subset Sum problem?
> **Answer:**
> * **Core Concept:** Minimizing transactions is an NP-complete problem. The greedy approach is a fast heuristic, not a guaranteed optimal solution.
> * **Detailed Breakdown:**
>   - **The Connection:** Finding the absolute minimum number of transactions is equivalent to finding the maximum number of independent, zero-sum subsets within the group.
>   - **Subset Sum Problem:** Determining if a subset of numbers sums to zero is a classic NP-complete problem.
>   - **Why Heuristics are used:** For a group of 10 people, running an exact algorithm to find the absolute minimum transactions is slow. The greedy algorithm is a heuristic: it runs instantly ($O(V \log V)$) and settles all debts in at most $V-1$ steps, which is close to optimal for practical use cases.

### Q40: Why did you use `std::priority_queue` (heaps) instead of sorting the array at each step?
> **Answer:**
> * **Core Concept:** Heaps are more computationally efficient than sorting.
> * **Key Reasons:**
>   - **Sorting Overhead:** Sorting the list at each step takes $O(V \log V)$ time. Doing this for every transaction results in a total runtime of $O(V^2 \log V)$.
>   - **Heap Efficiency:** A binary heap (`std::priority_queue`) allows us to extract the maximum element in $O(1)$ time and insert the remaining balance back in $O(\log V)$ time.
>   - **Overall Complexity:** Using heaps reduces the algorithm's runtime complexity to $O(V \log V)$, which is faster as the number of users increases.

### Q41: What happens to the time complexity if we use a simple sorted vector instead of priority queues?
> **Answer:**
> * **Core Concept:** A sorted vector requires shifting elements in memory, making it slower than a heap.
> * **Detailed Breakdown:**
>   - **Retrieval:** Finding the largest debtor/creditor in a sorted vector is fast ($O(1)$).
>   - **Insertion:** When we update a balance and insert it back, we must maintain the sorted order. Inserting into a vector requires shifting elements in memory, which takes linear time ($O(V)$).
>   - **Total Runtime:** Over $V$ iterations, this results in an overall complexity of $O(V^2)$, which is less efficient than the $O(V \log V)$ heap approach.

### Q42: How does the choice of `double` vs `float` affect precision in the C++ debt optimizer?
> **Answer:**
> * **Core Concept:** Floating-point numbers have precision limits. We use `double` because it offers higher precision, reducing rounding errors in financial calculations.
> * **Key Differences:**
>   - **`float`:** Uses 32 bits, offering about 7 decimal digits of precision.
>   - **`double`:** Uses 64 bits, offering 15 to 17 decimal digits of precision.
>   - **Why it matters:** When performing many additions and subtractions across multiple expenses, floating-point drift can occur (e.g., $10.00 might become $9.99999$). Using `double` reduces this drift, and we use a check (`balance > 1e-6`) to ignore negligible rounding differences.

### Q43: Can you describe a scenario where the greedy debt simplification algorithm results in a user paying someone they didn't owe directly? How do you justify this behavior to users?
> **Answer:**
> * **Core Concept:** The algorithm prioritizes group simplification over direct payment histories.
> * **Scenario:** A owes B $20. B owes C $20. The algorithm simplifies this to: A pays C $20. A does not know C, but pays them directly.
> * **Justification:**
>   - **Saves Steps:** It reduces the total number of payments from 2 to 1.
>   - **Equal Balances:** The net financial outcome for each individual is identical. A still spends $20, C still receives $20, and B is spared from acting as a middleman.
>   - **Opt-out Option:** In production, we can provide a toggle switch ("Simplify Debts") for users who prefer to pay their direct debts.

### Q44: How does the algorithm handle users who have a net balance of exactly zero?
> **Answer:**
> * **Core Concept:** Users who don't owe money and aren't owed money are ignored.
> * **Detailed Breakdown:**
>   - **Filtering:** When reading user balances, we check if the absolute balance is greater than our precision threshold (`EPSILON = 1e-6`).
>   - If a user's net balance falls within `[-EPSILON, EPSILON]`, we skip them. They are not added to either the creditor or debtor heaps, excluding them from the settlement calculations.

### Q45: What is the maximum number of transactions produced by the algorithm for $N$ users, and how does this compare to the worst-case unoptimized transactions?
> **Answer:**
> * **Core Concept:** The algorithm guarantees a maximum of $N-1$ transactions, compared to potential exponential growth in unoptimized networks.
> * **Comparison:**
>   - **Max Optimized Transactions:** $N-1$. Each step settles at least one user's balance, removing them from the heaps.
>   - **Worst-case Unoptimized Transactions:** $N(N-1)/2$. For example, in a group of 10 users, an unoptimized network could require 45 individual transfers, while the optimized layout requires at most 9.

### Q46: How would you modify the algorithm to prioritize direct settlements (i.e., making users pay the people they actually spent money with)?
> **Answer:**
> * **Core Concept:** Settle direct matches first before running the greedy heap algorithm.
> * **Detailed Breakdown:**
>   - **Graph Check:** We can build a directed graph of direct transactions.
>   - **Pre-Settlement Step:** Before running the heaps, check if a debtor owes a creditor the exact amount they need to settle their balances (e.g., A owes B $15, A needs to pay $15, and B is owed $15).
>   - **Settle Direct first:** If a match is found, settle it immediately and remove them from the heaps. This keeps payments familiar while maintaining a low overall transaction count.

### Q47: How would you handle groups where the sum of all net balances is not exactly zero due to precision errors?
> **Answer:**
> * **Core Concept:** Prevent balance mismatches during data entry rather than fixing them in the algorithm.
> * **Detailed Breakdown:**
>   - **Server-Side Validation:** When a user logs an expense, the API verifies that the sum of all participant shares equals the total expense amount.
>   - **Rounding Adjustments:** If a division results in fractional cents (e.g., splitting $10.00 among 3 people), the API allocates the remaining cent to the payer or first participant before saving. This ensures that the sum of all net balances is mathematically zero.

---

## 📌 Part 6: C++ Core & Pybind11 Integration (Q48 - Q55)

### Q48: What is Pybind11, and how does it compare to other binding methods like ctypes, Cython, or C extensions?
> **Answer:**
> * **Core Concept:** Pybind11 is a library that allows C++ code to be exposed to Python with minimal boilerplates.
> * **Comparison:**
>   - **C Extensions:** Requires writing verbose C code using the Python C API, which is complex and hard to maintain.
>   - **ctypes:** Accesses compiled C libraries directly, but requires writing manual wrappers in Python and handling raw C pointers, which can cause memory issues.
>   - **Cython:** Requires compiling a hybrid language.
>   - **Pybind11:** Uses standard C++11 templates to bind C++ functions and classes to Python with clean, type-safe code.

### Q49: Explain the overhead involved in passing data from Python to C++ via Pybind11. How can we minimize it?
> **Answer:**
> * **Core Concept:** Converting Python objects to C++ types takes time. We minimize this by batching our calls.
> * **Detailed Breakdown:**
>   - **Data Marshalling:** Python objects (like lists and dicts) must be converted into C++ types (like `std::vector` and structs). This requires memory allocation and copying, which incurs an overhead.
>   - **Mitigation:** Avoid calling C++ for individual calculations in loops. Instead, collect all group data in Python and make a single batch call to C++, minimizing boundary crossing overhead.

### Q50: How does the C++ compiler bridge the Python GIL (Global Interpreter Lock)? What happens to GIL during Pybind11 function execution?
> **Answer:**
> * **Core Concept:** Python code runs under a lock (GIL) that prevents multiple threads from executing Python code at the same time. C++ can release this lock to run code in parallel.
> * **Detailed Breakdown:**
>   - **Execution under GIL:** By default, C++ code called via Pybind11 runs under the GIL, blocking other Python threads.
>   - **Releasing the GIL:** If our C++ algorithm is long-running, we can release the GIL using `py::gil_scoped_release` inside our C++ wrapper:
>     ```cpp
>     py::gil_scoped_release release;
>     // Run C++ optimization logic
>     ```
>     This allows the Python web server to process other incoming requests while the C++ code runs in parallel.

### Q51: What is the role of `CMakeLists.txt` in compiling the C++ module, and how does the Python wrapper find the compiled binary?
> **Answer:**
> * **Core Concept:** `CMakeLists.txt` tells the compiler how to build our C++ module into a shared library that Python can import.
> * **How it works:**
>   - **Build Configuration:** It specifies our compiler settings, source files, and links the Pybind11 libraries.
>   - **Shared Library Output:** The build output is a shared library (`.so` on Linux, `.pyd` on Windows).
>   - **Path Resolution:** The Python wrapper (`optimizer.py`) adds the build directory to the search path (`sys.path.insert`), allowing Python to import the module: `import debt_optimizer`.

### Q52: How would you handle memory leaks or dangling pointers in your C++ code to prevent the FastAPI process from consuming infinite RAM?
> **Answer:**
> * **Core Concept:** Use modern C++ memory management practices to avoid leaks that could crash the server.
> * **Key Practices:**
>   - **Use RAII (Resource Acquisition Is Initialization):** Rely on C++ STL containers (like `std::vector` and `std::string`) that manage memory automatically.
>   - **Avoid Raw Pointers:** Avoid using `new` or `delete`.
>   - **Smart Pointers:** If dynamic allocation is needed, use `std::unique_ptr` or `std::shared_ptr`. These automatic wrappers delete the allocated object once it goes out of scope.

### Q53: How does Pybind11 handle type conversions between Python `dict` and C++ standard containers?
> **Answer:**
> * **Core Concept:** Pybind11 uses type conversion headers to copy values between Python and C++ structures.
> * **How it works:**
>   - We include `<pybind11/stl.h>` in our wrapper.
>   - Pybind11 loops through the Python dictionaries, extracts properties using `.cast<type>()`, and copies them into native C++ structs (like `Expense` and `ParticipantShare`).
>   - When returning results, it maps the C++ struct properties back into Python dictionaries.

### Q54: Why did you use `static_cast<double>` in the Pybind11 wrapper when casting user IDs?
> **Answer:**
> * **Core Concept:** Cast types explicitly to match our return map schema.
> * **Detailed Breakdown:**
>   - In `pybind_wrapper.cpp`, the results are returned as a list of dictionaries mapping string keys to double values: `std::unordered_map<std::string, double>`.
>   - Since user IDs are stored as integers (`int`), we use `static_cast<double>` to cast the integer IDs to doubles, allowing them to be returned in the double-typed map.

### Q55: How would you write automated tests in Python to verify the behavior of the C++ compiled module?
> **Answer:**
> * **Core Concept:** Use `pytest` to pass mock data to the C++ module and assert the results.
> * **Detailed Breakdown:**
>   - We write test cases in Python using `pytest`.
>   - We pass mock expenses (e.g., `[{"expense_id": 1, "paid_by": 1, "amount": 30.0, "participants": [...]}]`) to the C++ module.
>   - We assert that the returned settlement list matches our hand-calculated expectations (e.g., verifying who pays who and the total amounts).

---

## 📌 Part 7: Security & Authentication (Q56 - Q61)

### Q56: Explain how Supabase Auth works under the hood (JWT, access tokens, refresh tokens).
> **Answer:**
> * **Core Concept:** Supabase handles registration and issues signed tokens that clients use to authenticate subsequent requests.
> * **The Token Lifecycle:**
>   1. **Sign-in:** The user logs in with their credentials. Supabase validates them and returns a signed **access token** (JWT) and a **refresh token**.
>   2. **Authorized Requests:** The mobile app stores these tokens. For subsequent requests, it includes the access token in the `Authorization: Bearer <token>` header.
>   3. **Session Expiry:** Access tokens are short-lived (usually expiring in 1 hour). When they expire, the app uses the long-lived refresh token to request a new access token from Supabase in the background, keeping the session active without asking the user to log in again.

### Q57: What is JWT (JSON Web Token), and how does signature verification secure API requests?
> **Answer:**
> * **Core Concept:** A JWT is a signed string containing user identity data that the server can verify without querying the auth database on every request.
> * **How it works:**
>   - **Structure:** A JWT contains three parts separated by dots: a Header (algorithm details), a Payload (user UUID, expiry, claims), and a Signature.
>   - **Signature Verification:** Supabase signs the token using its private key. The FastAPI backend fetches Supabase's public key (JWKS).
>   - **Stateless Validation:** When a request arrives, the backend decrypts the signature using the public key. If the signature matches the payload, the backend knows the token is valid and extracts the user ID, avoiding a database lookup.

### Q58: What is the security risk of passing `auth_user_id` as a plain query parameter in GET requests, and how do you resolve it?
> **Answer:**
> * **Core Concept:** Query parameters can be logged in plain text and are easy to manipulate (BOLA risk).
> * **The Risks:**
>   - **Data Exposure:** Query parameters are often saved in server logs, proxy logs, and browser history.
>   - **ID Spoofing (BOLA):** A malicious user could change the `auth_user_id` UUID query parameter to access other users' groups or expenses.
> * **Resolution:** Send the Supabase session JWT in the `Authorization` header instead. The backend decodes and verifies the token, extracting the user ID directly from the secure payload.

### Q59: How would you protect the database from SQL Injection attacks in this project?
> **Answer:**
> * **Core Concept:** SQL Injection occurs when untrusted user inputs are executed as database commands. We prevent this by using parameterized queries.
> * **How to prevent it:**
>   - **SQLAlchemy ORM:** By default, SQLAlchemy uses parameterized queries (prepared statements). It separates the SQL query structure from the input values.
>   - **Input Escaping:** The database engine treats inputs strictly as data values, never as executable code.
>   - **Avoid Raw SQL:** Avoid string formatting (e.g., `f"SELECT * FROM users WHERE username = '{input}'"`) which is vulnerable to SQL injection.

### Q60: How does the database trigger (`handle_new_user`) ensure that database schemas are secure against unauthorized signups?
> **Answer:**
> * **Core Concept:** The trigger runs inside the database, preventing users from manually creating records in our public tables.
> * **How it works:**
>   - **Internal Execution:** The trigger only runs when a user record is inserted into the `auth.users` table by the Supabase Auth service.
>   - **Table Access:** We restrict direct write permissions on the `public.users` table. The only way a record is created is through the trigger. This prevents malicious clients from bypassing authentication and inserting dummy users into our database.

### Q61: What is Cross-Site Scripting (XSS), and how does the React Native mobile app protect against it?
> **Answer:**
> * **Core Concept:** XSS occurs when malicious scripts are injected into web pages and executed by browsers. React Native avoids this by not rendering HTML.
> * **How React Native protects:**
>   - **No DOM:** React Native does not use a web DOM or execute arbitrary JavaScript from strings.
>   - **Native Views:** Components like `<Text>` render text as native UI widgets (e.g., `UITextView` on iOS) rather than raw HTML. User inputs are treated strictly as plain text, rendering XSS exploits ineffective.

---

## 📌 Part 8: Systems Design, Scalability & Concurrency (Q62 - Q67)

### Q62: How would you implement caching for the calculated settlements using Redis? What is the cache invalidation strategy?
> **Answer:**
> * **Core Concept:** Store calculated settlements in Redis to avoid querying the database and running the C++ optimizer on every request.
> * **Implementation Strategy:**
>   - **Caching:** When a user requests settlements for a group, we check if the key `group:settlements:{group_id}` exists in Redis. If found, we return the cached JSON. If not, we query the DB, run the C++ optimizer, store the result in Redis with a TTL (e.g., 24 hours), and return it.
>   - **Invalidation:** We delete the cached key (`redis.delete(f"group:settlements:{group_id}")`) whenever a user adds, edits, or deletes an expense in that group.

### Q63: If this app went viral and reached 10 million users, how would you partition/shard the PostgreSQL database?
> **Answer:**
> * **Core Concept:** Shard the database horizontally using `group_id` as the shard key.
> * **How it works:**
>   - **Junction-based Sharding:** Since users interact within groups, expenses and settlements are queried in the context of a group.
>   - **Data Locality:** By sharding on `group_id`, all expenses, participants, and members for a group live on the same database node.
>   - **Scalability:** This allows us to scale horizontally by adding more database shards, avoiding slow cross-node joins.

### Q64: How do you handle concurrent expense edits by two different users in the same group? (Optimistic vs Pessimistic locking).
> **Answer:**
> * **Core Concept:** Lock database rows or use versioning to prevent users from overwriting each other's changes.
> * **Detailed Breakdown:**
>   - **Pessimistic Locking:** When a user edits an expense, we lock the row (`SELECT FOR UPDATE`). This blocks other users from updating that record until the transaction commits.
>   - **Optimistic Locking:** We add a `version` column to the table. When a user submits an update, we verify that the version matches what was read. If it does, we commit and increment the version. If not (meaning another user updated it first), we reject the edit and ask the user to reload the data.

### Q65: How would you design a system to process calculations asynchronously using Celery for groups with over 10,000 members?
> **Answer:**
> * **Core Concept:** Offload long-running calculations to background workers using a message queue.
> * **Step-by-Step Flow:**
>   1. **Enqueue Task:** When a user requests settlements for a large group, the API returns a task ID and a status of `PENDING`.
>   2. **Message Broker:** The API pushes the calculation task to a queue (like Redis or RabbitMQ).
>   3. **Workers:** Background Celery workers pick up the task, run the C++ optimization algorithm, and write the final result to the database or Redis cache.
>   4. **Client Notification:** The mobile client polls the status endpoint or listens via WebSockets to update the UI when the task completes.

### Q66: Explain how you would deploy this backend using Docker containers.
> **Answer:**
> * **Core Concept:** Package the backend and its dependencies into a Docker image to ensure consistent environments.
> * **Deployment Steps:**
>   - **Dockerfile:** Write a multi-stage Dockerfile:
>     1. Install compiler tools (`build-essential`, `cmake`, `g++`) to build the C++ module.
>     2. Install Python dependencies and compile the C++ shared library module.
>     3. Use a lightweight base image (like `python:3.10-slim`) to run the final Uvicorn app.
>   - **Docker Compose:** Use Compose to define the application service, database, and Redis cache, making local deployment simple.

### Q67: How would you monitor backend health, API latency, and database query bottlenecks in a production environment?
> **Answer:**
> * **Core Concept:** Set up APM tools, logging, and metrics to monitor system health.
> * **Key Practices:**
>   - **APM Integration:** Integrate tools like Sentry or Datadog to track API errors and response times.
>   - **SQL Auditing:** Use PostgreSQL's `pg_stat_statements` to identify slow-running queries that need indexes.
>   - **Log Routing:** Route logs to a centralized log aggregator (like Grafana Loki or ELK Stack) to monitor errors.
>   - **Health Probe:** Configure `/health` endpoints to monitor database connectivity and service status.

---

## 📌 Part 9: Technical Curveballs & Edge Cases (Q68 - Q75)

### Q68: How does the system handle circular debts (A owes B, B owes C, C owes A)?
> **Answer:**
> * **Core Concept:** Circular debts are automatically resolved during the net balance calculation step before the optimization algorithm runs.
> * **Example:**
>   - A owes B $10 ($A = -10$, $B = +10$).
>   - B owes C $10 ($B = +10 - 10 = 0$, $C = +10$).
>   - C owes A $10 ($C = +10 - 10 = 0$, $A = -10 + 10 = 0$).
>   - Since everyone's net balance is exactly zero, they are excluded from the priority queues, resolving the loop in $O(E)$ time.

### Q69: How do you handle splitting an expense where the split yields fractional cents (e.g. splitting $10.00 among 3 people)?
> **Answer:**
> * **Core Concept:** Store currency as integers (in cents) and allocate remainder cents to prevent financial leakage.
> * **Detailed Breakdown:**
>   - **Cents as Integers:** Store values in cents (e.g., $10.00 is stored as `1000`) using `BigInteger` columns to avoid floating-point rounding errors.
>   - **Calculate Split:** Dividing 1000 cents by 3 people yields 333.333... cents per person.
>   - **Adjust Remainder:** Round the share to 333 cents. The remainder is $1000 - (333 \times 3) = 1$ cent. The backend allocates this remaining cent to the payer or first participant (e.g., Person 1 pays 334 cents, while the others pay 333 cents), ensuring the sum of all shares matches the total.

### Q70: What happens if the C++ module encounters a segmentation fault or crashes? How do you prevent it from taking down the FastAPI backend?
> **Answer:**
> * **Core Concept:** A segmentation fault in C++ will crash the Python interpreter. We prevent this using input validation, unit tests, or process isolation.
> * **Detailed Breakdown:**
>   - **The Problem:** Because the C++ module runs in-process via Pybind11, a segmentation fault will crash the entire Python process.
>   - **Mitigation:**
>     - Validate inputs in C++ to prevent out-of-bounds access.
>     - Use standard C++ containers (`std::vector`, `std::string`) that handle memory automatically.
>     - **Process Isolation:** For high-reliability environments, run the C++ optimizer as a separate microservice communicating via gRPC, isolating the web server from C++ crashes.

### Q71: How would you support multi-currency splits where users pay in different currencies (e.g., USD, EUR, INR) within the same group?
> **Answer:**
> * **Core Concept:** Define a group currency and convert transactions during settlement calculation.
> * **Implementation Steps:**
>   1. The group has a default currency (e.g., USD).
>   2. When logging an expense, record the local currency and the conversion rate to the default currency.
>   3. Convert all expenses to the default currency during calculation.
>   4. Run the C++ optimizer in the default currency, then convert the output back to the respective currencies for settlement.

### Q72: How would you implement the "Simplify Debts" toggle in your backend (meaning users can choose whether to use the C++ optimizer or keep direct debts)?
> **Answer:**
> * **Core Concept:** Use conditional routing to choose between the simplified C++ algorithm and direct debt aggregation.
> * **Detailed Breakdown:**
>   - **Simplify Debts OFF:** Settle debts using direct aggregation. For example, if A owes B $10 from transaction 1 and $15 from transaction 2, the simplified output is: A pays B $25.
>   - **Simplify Debts ON:** Run the C++ heap-based optimization algorithm to minimize overall transactions.

### Q73: What happens if a user is deleted from the system? How do you handle their historical expenses and open debts?
> **Answer:**
> * **Core Concept:** Prevent user deletion if they have outstanding balances, and anonymize their profile if they don't.
> * **Detailed Breakdown:**
>   - **Validation:** Block deletion requests if the user has a non-zero balance in any of their groups.
>   - **Anonymization:** If their balance is zero, anonymize their profile (e.g., renaming them to "Deleted User" and removing personal data) instead of deleting the row. This preserves historical logs and keeps the group ledger consistent.

### Q74: If the C++ optimizer is running on a multi-core server, how could you parallelize the calculations for multiple groups?
> **Answer:**
> * **Core Concept:** Calculations for different groups are independent, making them easy to run in parallel.
> * **Detailed Breakdown:**
>   - **Python Process Pool:** Use Python's `ProcessPoolExecutor` to run calculations in parallel, bypassing the GIL.
>   - **C++ Multi-threading:** Release the GIL in Pybind11 and use C++ multi-threading (`std::thread` or `std::async`) to process calculations in parallel on multiple CPU cores.

### Q75: Is it possible to implement the debt optimization algorithm using a network flow approach instead of a greedy heuristic? What are the trade-offs?
> **Answer:**
> * **Core Concept:** A network flow approach (Minimum Cost Flow) guarantees the optimal solution, but is more complex than the greedy heuristic.
> * **Trade-offs:**
>   - **Greedy Heuristic:** Fast ($O(V \log V)$) and simple, but does not guarantee the minimum transaction count.
>   - **Network Flow:** Finds the optimal solution, but has higher computational complexity and is harder to implement. For typical group sizes, the greedy heuristic is generally preferred for its simplicity and speed.