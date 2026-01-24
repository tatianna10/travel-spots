# Travel Spots  

**TravelSpots** is a full-stack MERN application deployed on Vercel, featuring a serverless REST API, JWT-based authentication, and a cloud-hosted MongoDB Atlas database. It is a modern React web application that allows users to discover, share, and manage interesting places around the world. The platform includes a public catalog, user authentication, full CRUD operations, likes, comments, and role-protected routes.

🔗 Live App: https://travel-spots-beta.vercel.app/

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router

**Backend**
- Node.js / Express (Serverless on Vercel)
- MongoDB Atlas (cloud database)
- Mongoose ODM
- JWT-based authentication (stateless)
- bcryptjs password hashing
- dotenv for environment configuration

**Deployment**
- Vercel (frontend + serverless API)
- REST API deployed as Vercel Serverless Functions
- MongoDB Atlas used as external cloud database

---

##  Project Structure
```
🧳 travel-spots
 ┣ 📂src
 ┃ ┣ 📂assets
 ┃ ┣ 📂components
 ┃ ┣ 📂pages
 ┃ ┣ 📂hooks
 ┃ ┣ 📂services
 ┃ ┣ 📜App.jsx
 ┃ ┗ 📜main.jsx
 ┣ 📂public
 ┃ ┗ 🖼️ static files
 ┣ 📂server
 ┃ ┣ 📜server.js
 ┃ ┣ 📜app.js
 ┃ ┣ 📂routes
 ┃ ┣ 📂models
 ┃ ┣ 📂config
 ┃ ┗ 📂middlewares
 ┣ 📂api
 ┃ ┗ 📜index.js
 ┣ 📜vite.config.js
 ┣ 📜package.json
 ┗ 📜vercel.json

```
---

##  Features

- Public catalog of travel spots
- Details page for each spot
- Authentication (Register / Login)
- Protected actions:
  - Create spot
  - My Places (edit/delete your own spots)
- Rate limiting for auth endpoints
- Responsive UI (mobile-friendly header + grids)

---

##  Backend — MongoDB Collections

### Collection: `places`
```json
    {
      "_id": "696d05f1b75f7bed4ad1d11f",
      "title": "Paris, France",
      "city": "Paris",
      "country": "France",
      "description": "The romantic capital of the world.",
      "longDescription": "Paris is known for the Eiffel Tower, rich culture, museums, fashion, luxury cafes, and historic architecture.",
      "imageUrl": "https://images2.alphacoders.com/561/thumb-1920-561115.jpg",
      "category": "romantic",
      "createdAt": "2026-01-18T16:10:25.674+00:00",
      "updatedAt": "2026-01-18T16:10:25.674+00:00"
    }
```

### Collection: `users`
```json
   {
      "_id": "696d037db75f7bed4ad1d0f3",
      "email": "mick@abv.bg",
      "fullName": "Mick James",
      "password": "hashed_password",
      "createdAt": "2026-01-18T15:59:57.357+00:00",
      "updatedAt": "2026-01-18T15:59:57.357+00:00"
    }
```

### Collection: `comments`
```json
      {
      "_id": "696d0990b75f7bed4ad1d152",
      "placeId": "696d08dbb75f7bed4ad1d147",
      "text": "nice",
      "authorId": "696d03b9b75f7bed4ad1d0fb",
      "createdAt": "2026-01-18T16:25:52.185+00:00",
      "updatedAt": "2026-01-18T16:25:52.185+00:00"
    }
```

### Collection: `likes`
```json
     {
      "_id": "51b04d16119d49cca13431416e4fecbc",
      "placeId": "54e70b2e7e0c4dc6a9d98b9077b9a0b9",
      "userId": "b5042f586a114e1b81f84b447da01348",
      "createdAt": "2026-01-18T12:00:00.000Z",
      "updatedAt": "2026-01-18T12:00:00.000Z"
    }
```
---

## Backend API 

### Authentication

* POST `/api/users/login`
* POST `/api/users/register`
* JWT token is stored in the browser `localStorage` after login/registration.
* For protected routes the client sends:
`Authorization: Bearer <JWT_TOKEN>`

### Places

| Method | Endpoint               | Access        | Description             |
| ------ | ---------------------- | ------------- | ----------------------- |
| GET    | `/api/data/places`     | Public        | Retrieve all places     |
| GET    | `/api/data/places/:id` | Public        | Retrieve a single place |
| POST   | `/api/data/places`     | Authenticated | Create a new place      |
| PUT    | `/api/data/places/:id` | Owner only    | Edit an existing place  |
| DELETE | `/api/data/places/:id` | Owner only    | Delete your place       |


### Comments

| Method | Endpoint                         | Access        | Description                |
| ------ | -------------------------------- | ------------- | -------------------------- |
| GET    | `/api/data/comments?placeId=:id` | Public        | Fetch comments for a place |
| POST   | `/api/data/comments`             | Authenticated | Add a comment              |

✔ Owners cannot comment on their own places  
✔ Comments are sorted by newest first



### Likes

| Method | Endpoint                                       | Access        | Description                   |
| ------ | ---------------------------------------------- | ------------- | ----------------------------- |
| GET    | `/api/data/likes?placeId=:id`                  | Public        | Get total likes count         |
| GET    | `/api/data/likes/check?placeId=:id&userId=:id` | Authenticated | Check if a user liked a place |
| POST   | `/api/data/likes`                              | Authenticated | Like a place                  |
| DELETE | `/api/data/likes/:id`                          | Authenticated | Unlike a place                |

✔ One like per user  
✔ Owners cannot like their own places



### Authentication Endpoints

| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| POST   | `/api/users/login`    | Login user           |
| POST   | `/api/users/register` | Create a new account |

---

## Setup & Local Development

### Clone the repository:

   ```bash
   git clone https://github.com/tatianna10/travel-spots.git
   cd travel-spots
  ```
### Install dependencies:
   ```bash
   npm install
   ```

### Create a .env file in the root:
```bash
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BCRYPT_ROUNDS=12
PORT=3030
```

### Run locally frontend + backend:
```bash
npm run dev
```
- Frontend: http://localhost:5173
- API: http://localhost:3030

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

## Bonus Functionality

### Category Filter
Allows filtering by category directly in the catalog without additional server calls, improving user navigation.

### Search Bar
Filters places in real time while typing. Uses controlled input and enhances usability on large datasets.

### Scroll-to-Top Button
Appears after scrolling and smoothly scrolls to the top of the page. Improves UX on long catalogs.

---

##  License
- MIT License




