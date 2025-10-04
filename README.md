# BookBee - Book Review Platform

A full-stack MERN application for book reviews with user authentication, CRUD operations, and pagination.

## Features

- User authentication (signup/login) with JWT
- Book management (add, edit, delete, view)
- Review system with ratings (1-5 stars)
- Pagination (5 books per page)
- Average rating calculation
- Protected routes
- Responsive design with Bootstrap

## Tech Stack

- **Frontend**: React, React Router, Axios, Bootstrap
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Database**: MongoDB Atlas

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file and add:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books?page=1` - Get books with pagination
- `GET /api/books/:id` - Get book details with reviews
- `POST /api/books` - Add new book (protected)
- `PUT /api/books/:id` - Update book (protected, owner only)
- `DELETE /api/books/:id` - Delete book (protected, owner only)

### Reviews
- `POST /api/reviews` - Add review (protected)
- `PUT /api/reviews/:id` - Update review (protected, owner only)
- `DELETE /api/reviews/:id` - Delete review (protected, owner only)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed)
}
```

### Book
```javascript
{
  title: String,
  author: String,
  description: String,
  genre: String,
  year: Number,
  addedBy: ObjectId (User reference)
}
```

### Review
```javascript
{
  bookId: ObjectId (Book reference),
  userId: ObjectId (User reference),
  rating: Number (1-5),
  reviewText: String
}
```

## Usage

1. Sign up for a new account or login
2. Browse books on the home page
3. Click on a book to view details and reviews
4. Add new books (requires login)
5. Leave reviews and ratings for books
6. Edit/delete your own books and reviews

## Project Structure

```
BookBee/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── utils/
    └── public/
```