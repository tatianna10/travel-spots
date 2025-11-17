# Travel Spots  
**TravelSpots** is a modern React web application that allows users to discover, share, and manage interesting places around the world. The platform includes a public catalog, user authentication, full CRUD operations, likes/comments, maps integration, and protected routes.

---

##  Features

###  Public Area
- Home / Landing page  
- Catalog of all places  
- Place details (image, description, map)  
- Login / Register pages  

###  Private Area
- Create a place  
- Edit your own places  
- Delete your own places  
- My Places page  
- Like & comment on other users’ places  
- Optional: Profile page  

###  Route Guards
- **PrivateRoute** — accessible only for authenticated users  
- **GuestRoute** — accessible only for guests (login/register)  

---

##  Backend — Collections & API

### Collection: `places`
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "imageUrl": "string",
  "location": {
    "lat": 42.6977,
    "lng": 23.3219,
    "address": "Sofia, Bulgaria"
  },
  "createdAt": "string",
  "ownerId": "string",
  "likes": ["userId1", "userId2"],
  "comments": [
    { "userId": "123", "text": "Nice place!", "createdAt": "2024-03-10" }
  ]
}
```

### API Endpoints
- GET /api/places  
- GET /api/places/:id  
- POST /api/places (authenticated)  
- PUT /api/places/:id (owner only)  
- DELETE /api/places/:id (owner only)  

### Authentication
- POST /api/users/login  
- POST /api/users/register  
- JWT token stored in `localStorage`  
- Sent via `Authorization: Bearer <token>`  

---

##  Tech Stack

### Frontend
- React 18+  
- React Router v6  
- Context API (AuthContext)  
- Custom hooks (useAuth, useForm)  
- External CSS / SCSS  

Optional:  
- Redux Toolkit  
- Google Maps API  
- Cloudinary / Firebase Storage  

### Backend (any working backend)
- Firebase  
- Node.js + Express + MongoDB  
- ASP.NET / Spring / Symfony  

---

##  Project Structure
```
src/
  api/
    authApi.js
    placesApi.js
  components/
    Header/
    Footer/
    PlaceCard/
    PlaceForm/
    CommentList/
    Map/
  contexts/
    AuthContext.jsx
  store/
    placesSlice.js
  hooks/
    useAuth.js
    useForm.js
  pages/
    Home.jsx
    Catalog.jsx
    PlaceDetails.jsx
    CreatePlace.jsx
    EditPlace.jsx
    MyPlaces.jsx
    Login.jsx
    Register.jsx
    NotFound.jsx
  guards/
    PrivateRoute.jsx
    GuestRoute.jsx
  styles/
    global.css
    form.css
    header.css
  App.jsx
  index.jsx
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

### Build for production
```bash
npm run build
```

### Start backend (example for Node.js)
```bash
npm run server
```

---

##  Authentication Flow
1. User logs in or registers  
2. Server returns a JWT token  
3. Token is stored in `localStorage`  
4. AuthContext stores user & auth functions  
5. Protected requests include the Authorization header  
6. PrivateRoute blocks unauthenticated access  

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
- Controlled components (forms)  
- Synthetic events (onClick, onSubmit, onChange)  
- Component lifecycle via useEffect  
- Stateless & stateful components  
- External CSS styling  

---

##  Optional Bonuses
- Redux Toolkit for global state  
- Google Maps integration  
- Image upload (Cloudinary/Firebase)  
- Weather API  
- Deployment (Netlify, Vercel, Firebase Hosting)  

---

##  Development Plan (Example)
**Day 1–2:** Layout, routing, Home/Catalog (mock data)  
**Day 3–4:** Auth + Guards + API connection  
**Day 5–6:** CRUD operations, MyPlaces, Likes/Comments  
**Day 7+:** Maps, file upload, Redux, styling, README  

---

##  License
MIT License (or any license you prefer)
