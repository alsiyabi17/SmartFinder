# SmartFinder

A full-stack restaurant finder web application that lets users discover restaurants, view details, save favorites, and make reservations. Admins can manage restaurants and meals through a dedicated dashboard.

Built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## Features

### For Users
- Browse and search restaurants by name, category, or rating
- View detailed restaurant pages with menus, photos, and location
- Save restaurants to a personal favorites list
- Make and manage reservations
- Create an account, log in, and edit profile information

### For Admins
- Add, edit, and delete restaurants
- Manage restaurant meals (name, price, category, image)
- Update restaurant details including location coordinates

### Technical
- JWT-based authentication with role-based access (user / admin)
- Redux Toolkit for client-side state management
- Responsive UI built with Reactstrap and Bootstrap 5
- Dockerized client for production deployment

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Redux Toolkit + React Redux
- React Router v7
- Reactstrap + Bootstrap 5
- Axios
- Vitest + Testing Library

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- CORS + dotenv

---

## Project Structure

```
SmartFinder/
├── Client/
│   └── SmartFinder/        # React frontend (Vite)
│       ├── src/
│       │   ├── components/ # Reusable UI components
│       │   ├── pages/      # Route-level pages
│       │   ├── features/   # Redux slices
│       │   ├── services/   # API service layer
│       │   └── store.js    # Redux store
│       └── Dockerfile
├── Server/                 # Express + MongoDB backend
│   ├── config/             # DB connection
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models (User, Restaurant, Reservation)
│   ├── routes/             # API routes
│   └── server.js
└── package.json            # Root scripts for running both apps
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/alsiyabi1711/SmartFinder.git
cd SmartFinder
```

### 2. Install dependencies (root, client, and server)
```bash
npm install
```
This automatically installs dependencies for both the client and server.

### 3. Configure environment variables
Create a `.env` file inside the `Server/` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartfinder
JWT_SECRET=your_jwt_secret_here
```

### 4. Run the app in development
```bash
npm run dev
```
This starts the backend on **http://localhost:5000** and the frontend on **http://localhost:5173** concurrently.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs client and server in development mode |
| `npm run dev:server` | Runs only the backend (with nodemon) |
| `npm run dev:client` | Runs only the frontend (Vite) |
| `npm run build` | Builds the frontend for production |
| `npm start` | Runs both apps in production mode |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate and receive JWT |
| GET | `/restaurants` | Get all restaurants |
| GET | `/restaurants/:id` | Get restaurant details |
| POST | `/restaurants` | Create restaurant (admin) |
| PUT | `/restaurants/:id` | Update restaurant (admin) |
| DELETE | `/restaurants/:id` | Delete restaurant (admin) |
| GET | `/users/me` | Get current user profile |
| PUT | `/users/me` | Update profile |
| GET | `/reservations` | Get user reservations |
| POST | `/reservations` | Create a reservation |

---

## Testing

Frontend tests use **Vitest** and **React Testing Library**:

```bash
cd Client/SmartFinder
npm test
```

---

## Docker (Frontend)

A production Dockerfile is provided for the client:

```bash
cd Client/SmartFinder
docker build -f Dockerfile.prod -t smartfinder-client .
docker run -p 8080:80 smartfinder-client
```

---

## Roadmap

- [ ] Real-time reservation notifications
- [ ] Map-based restaurant search
- [ ] User reviews and ratings
- [ ] Image uploads (instead of URLs)
- [ ] Payment integration

---

## Author

**Mohammed Alsiyabi**
**Jokha Alshabibi**

---

## License

This project is licensed under the ISC License.
