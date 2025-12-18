# Travel Spots  
**TravelSpots** is a modern React web application that allows users to discover, share, and manage interesting places around the world. The platform includes a public catalog, user authentication, full CRUD operations, likes/comments and protected routes.

---

##  Features

###  Public Area
- Home / Landing page  
- Catalog of all places  
- Place details (image, description, commnets, likes)  
- Login / Register pages  

###  Private Area
- Create a place  
- Edit your own places  
- Delete your own places  
- My Places page  
- Like & comment on other users’ places  

###  Route Guards
- **PrivateRoute** — accessible only for authenticated users  
- **GuestRoute** — accessible only for guests (login/register)  

---

##  Backend — Collections & API

### Collection: `places`
```json
  "places": [
    {
      "id": "78877795-98e5-4fd6-b90c-6a792dbbb1db",
      "title": "Paris, France",
      "city": "Paris",
      "country": "France",
      "description": "The romantic capital of the world.",
      "longDescription": "Paris is known for the Eiffel Tower, rich culture, museums, fashion, luxury cafes, and historic architecture.",
      "imageUrl": "https://images2.alphacoders.com/561/thumb-1920-561115.jpg",
      "category": "romantic",
      "ownerId": "1196316b-f606-4094-a84a-73810b123382",
      "createdAt": 1763670005123
    }
]
```

### Collection: `users`
```json
  "users": [
   {
      "id": "1196316b-f606-4094-a84a-73810b123382",
      "email": "mick@abv.bg",
      "fullName": "Mick James",
      "password": "$2b$10$SU.4peE.Wl68DJK/TFGsieluRACd9RMY4rfXPMMP/Z3sbri1kDGiW"
    }
]
```

### Collection: `comments`
```json
  "comments": [
      {
      "id": "d1cd8396-a5fa-4583-a11a-05108c503d97",
      "placeId": "7cc16866-46e2-427c-b378-2fbf54e2b41a",
      "text": "nice",
      "authorId": "06bb4519-3db9-4af1-9831-26718b6ee1e1",
      "createdAt": 1764268027547
    }
]
```

### Collection: `likes`
```json
  "likes": [
     {
      "id": "51b04d16-119d-49cc-a134-31416e4fecbc",
      "placeId": "54e70b2e-7e0c-4dc6-a9d9-8b9077b9a0b9",
      "userId": "b5042f58-6a11-4e1b-81f8-4b447da01348",
      "createdAt": 1764252989828
    }
]
```

## Backend API 

### Authentication
- POST /api/users/login  
- POST /api/users/register  
- JWT token stored in `localStorage`  
- Sent via `X-Authorization`  

### Places
| Method | Endpoint | Access | Description |
|-------|----------|--------|-------------|
| GET | `/data/places` | Public | Retrieve all places |
| GET | `/data/places/:id` | Public | Retrieve a single place |
| POST | `/data/places` | Authenticated | Create a new place |
| PUT | `/data/places/:id` | Owner only | Edit an existing place |
| DELETE | `/data/places/:id` | Owner only | Delete your place |

---

### Comments
| Method | Endpoint | Access | Description |
|-------|----------|--------|-------------|
| GET | `/data/comments?placeId=:id` | Public | Fetch comments for a place |
| POST | `/data/comments` | Authenticated | Add a comment |

[x] **Owners cannot comment on their own place**  
[x] Comments sorted newest first

---

### Likes
| Method | Endpoint | Access | Description |
|-------|----------|--------|-------------|
| GET | `/data/likes?placeId=:id` | Public | Get total likes count |
| GET | `/data/likes/check?placeId=:id&userId=:id` | Authenticated | Check if user liked a place |
| POST | `/data/likes` | Authenticated | Like a place |
| DELETE | `/data/likes/:id` | Authenticated | Unlike a place |

[x] One like per user  
[x] Owner cannot like own place

---

## Authentication

| Method | Endpoint | Description |
|-------|----------|-------------|
| POST | `/users/login` | Login user |
| POST | `/users/register` | Create a new account |

---

##  Tech Stack

### Frontend
- React 18+  
- React Router v6  
- Context API (AuthContext)  
- Custom component-based styling using external CSS files

### Backend (any working backend)
- Node.js + Express 
- Custom JSON storage (`db.json`) used as a lightweight database
 
---

##  Project Structure
```
📦src
 ┣ 📂api
 ┣ 📂components
 ┣ 📂contexts
 ┣ 📂guards
 ┣ 📂utils
 ┣ 📜App.jsx
 ┗ 📜main.jsx
```
---

##  Getting Started

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

### Start backend (example for Node.js)
```bash
node .\server.js
```

---

##  Authentication Flow

1. User registers or logs in with email and password
2. The backend creates a signed JWT token using `jsonwebtoken`
3. The token is returned to the client and stored in `localStorage`
4. `AuthContext` reads the token and user data and exposes login/logout functions
5. The token is used to keep the user logged in between page refreshes
6. React guards protect client routes:
   - **PrivateRoute** — only for authenticated users
   - **GuestRoute** — only for guests
7. The backend does not validate the JWT on each request; route protection happens on the frontend

---

##  Routing (React Router 6)

### Public Routes
- `/` — Home  
- `/catalog` — List of all places  
- `/places/:id` — Place details  
- `/login`  
- `/register`  

### Private Routes
- `/create`  
- `/my-places`  
- `/places/:id/edit`  

Route protection:
- `<PrivateRoute>` for logged-in users  
- `<GuestRoute>` for guests only  

---

##  React Concepts Covered
- useState
- useEffect
- useContext
- Context API
- Controlled components
- Synthetic events
- Stateless components
- Stateful components
- Client-side routing
- Route guards
- Conditional rendering
- External CSS styling

---

## Bonus Functionality

### Category Filter
Allows filtering by category directly in the catalog without additional server calls, improving user navigation.

### Search Bar
Filters places in real time while typing. Uses controlled input and enhances usability on large datasets.

### Scroll-to-Top Button
Appears after scrolling and smoothly scrolls to the top of the page. Improves UX on long catalogs.

---

##  License
MIT License


