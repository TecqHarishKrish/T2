 HEAD
 HEAD
# Exam Portal - Full Stack Application

A complete exam management system built with MERN stack (MongoDB, Express, React, Node.js).

## Features

### Student Portal
- User registration and login
- View available exams
- Take exams with timer
- View results and performance history
- Real-time exam interface with progress tracking

### Admin Portal
- Admin login and dashboard
- Create and manage exams
- View student performance statistics
- Exam analytics and reporting

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd team-2-project
```

### 2. Install dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Setup Database

Make sure MongoDB is running on your system, then seed the database:

```bash
# From the root directory
node seedDatabase.js
```

This will create:
- Admin user: `admin@examportal.com` / `admin123`
- Student user: `student@examportal.com` / `password123`
- Sample exams for testing

### 4. Start the application

#### Start Backend Server
```bash
# From the root directory
npm start
```
Server will run on `http://localhost:5000`

#### Start Frontend Development Server
```bash
# From the frontend directory
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## Usage

### Admin Access
1. Navigate to `http://localhost:5173`
2. Click "Login as Admin"
3. Use credentials: `admin@examportal.com` / `admin123`
4. Create exams and manage the system

### Student Access
1. Navigate to `http://localhost:5173`
2. Register a new account or login as student
3. Use demo credentials: `student@examportal.com` / `password123`
4. Take available exams and view results

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Exams
- `GET /api/exams/available` - Get available exams
- `POST /api/exams` - Create exam (admin only)
- `GET /api/exams/:id/start` - Start exam
- `POST /api/exams/:id/submit` - Submit exam

### Results
- `GET /api/results/student` - Get student results
- `GET /api/results/:id` - Get result details

## Project Structure

```
team-2-project/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   └── router/          # Routing configuration
│   └── package.json
├── models/                   # Mongoose models
│   ├── User.js
│   ├── Exam.js
│   └── Result.js
├── routes/                   # Express routes
│   ├── auth.js
│   ├── exams.js
│   └── results.js
├── server.js                 # Express server
├── seedDatabase.js           # Database seeder
└── package.json
```

## Development

### Adding New Features
1. Create/update models in `models/` directory
2. Add API routes in `routes/` directory
3. Create frontend components in `frontend/src/components/`
4. Add pages in `frontend/src/pages/`
5. Update routing in `frontend/src/router/`

### Environment Variables
Create a `.env` file in the root directory:
```
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/exam-portal
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

# T2
f3aa99d8ad7813ffc7accfbb32b77a00df8092bb

1f84676368824ce97bbf174fce5a2e6684c7a0a5
