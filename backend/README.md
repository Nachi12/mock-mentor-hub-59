# MeetConnect Backend API

## Setup Instructions

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Environment Variables**
Create a `.env` file and update with your values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meetconnect
JWT_SECRET=your_jwt_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

3. **Start MongoDB**
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud database
```

4. **Run the Server**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token

### Interviews
- `GET /api/interviews` - Get user's interviews
- `GET /api/interviews/:id` - Get single interview
- `POST /api/interviews` - Schedule new interview
- `PUT /api/interviews/:id` - Update interview
- `PUT /api/interviews/:id/complete` - Mark interview as completed
- `PUT /api/interviews/:id/feedback` - Add feedback (Interviewer only)
- `DELETE /api/interviews/:id` - Cancel interview
- `GET /api/interviews/stats/summary` - Get interview statistics

### Resources
- `GET /api/resources` - Get all resources with filters
- `GET /api/resources/questions` - Get interview questions
- `GET /api/resources/blogs` - Get blog posts
- `GET /api/resources/:id` - Get single resource
- `POST /api/resources` - Create resource (Admin only)
- `PUT /api/resources/:id` - Update resource (Admin only)
- `POST /api/resources/:id/like` - Like a resource
- `DELETE /api/resources/:id` - Delete resource (Admin only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `DELETE /api/users/account` - Delete account
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `GET /api/users/interviewers` - Get list of interviewers

## Authentication
The API uses JWT tokens for authentication. Include the token in the header:
```
Authorization: Bearer <token>
```
or
```
x-auth-token: <token>
```

## Error Handling
All errors return JSON with appropriate HTTP status codes:
```json
{
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Data Models

### User
- name, email, password, contact, dob
- role: student/interviewer/admin
- profilePicture, isActive, emailVerified

### Interview
- userId, type, date, time, interviewer
- status: upcoming/ongoing/completed/cancelled
- feedback, score, result
- resources, questions, meetingLink

### Resource
- title, category, type, content
- difficulty, tags, views, likes
- questions array for practice
- isPremium flag for paid content

## Testing with Postman

1. **Register a User**
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "contact": "1234567890"
}
```

2. **Login**
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
```

3. **Schedule Interview**
```
POST http://localhost:5000/api/interviews
Headers: {
  "x-auth-token": "<your_token>"
}
Body: {
  "type": "frontend",
  "date": "2024-01-15",
  "time": "14:30",
  "interviewer": "Jane Smith"
}
```

## Production Deployment

1. Update environment variables for production
2. Use MongoDB Atlas for cloud database
3. Deploy to services like:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway
   - Render

4. Enable CORS for your frontend domain
5. Use PM2 for process management
6. Set up SSL certificate for HTTPS