# hands-on-volunteering-platform

# Volunteer Management Platform

## 📌 Project Overview
This is a platform designed to connect volunteers with community-driven events and help requests. The platform allows users to register, manage their profiles, discover volunteer events, join community help posts, and coordinate with others. It aims to simplify the process of volunteer management and event participation, fostering a supportive and engaged community.

---

## 📌 Technologies Used
- **Backend**: NestJS
- **Frontend**: Next.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: Tailwind CSS
- **API**: RESTful API using NestJS

---

## 📌 Features

1. **User Registration & Profile Management**
   - Users can sign up with an email & password.
   - Users create and update their profiles (skills, interests, volunteer history).
   - Users can edit their profile anytime.
   - 🎯 Goal: A simple profile dashboard for volunteers.

2. **Discover & Join Volunteer Events**
   - Users or organizations can create events with details (title, date, location, description).
   - A public event list allows users to browse & filter events.
   - Users can join an event with a single click.
   - 🎯 Goal: A simple way to find & register for events.

3. **Community Help Requests**
   - Users can post requests for help (e.g., "Need volunteers for food drive").
   - Other users can offer help and coordinate via messages.
   - Each request has an urgency level (low, medium, urgent).
   - 🎯 Goal: A help request board for quick volunteer support.

---

## 📌 Database Schema

### Users Table
| Column Name       | Data Type | Description                        |
|-------------------|-----------|------------------------------------|
| id                | SERIAL    | Primary key, auto-incrementing     |
| email             | VARCHAR   | User's email (unique)             |
| password          | VARCHAR   | User's encrypted password         |
| skills            | TEXT      | Skills of the user                |
| interests         | TEXT      | Interests of the user             |
| volunteer_history | TEXT      | User's previous volunteer work    |

### Events Table
| Column Name  | Data Type  | Description                        |
|--------------|------------|------------------------------------|
| id           | SERIAL     | Primary key, auto-incrementing     |
| title        | VARCHAR    | Event title                       |
| description  | TEXT       | Event description                 |
| location     | VARCHAR    | Event location                    |
| date         | DATE       | Event date                        |
| created_by   | INT        | Foreign key (users table)         |

### Help Requests Table
| Column Name    | Data Type  | Description                        |
|----------------|------------|------------------------------------|
| id             | SERIAL     | Primary key, auto-incrementing     |
| user_id        | INT        | Foreign key (users table)         |
| description    | TEXT       | Request description               |
| urgency        | VARCHAR    | Urgency level (low, medium, urgent)|
| created_at     | TIMESTAMP  | Timestamp of the request creation |

---

## 📌 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/volunteer-management.git
cd volunteer-management


### 2. Backend Setup (NestJS)
Navigate to the backend folder
bash
Copy
Edit
cd backend
Install dependencies
bash
Copy
Edit
npm install
Configure environment variables:

Create a .env file in the root directory of the backend.
Set up the following variables:
ini
Copy
Edit
DATABASE_URL=postgres://user:password@localhost:5432/your-database
JWT_SECRET=your-jwt-secret
Run the backend server

bash
Copy
Edit
npm run start:dev

### 3. Frontend Setup (Next.js)
Navigate to the frontend folder
bash
Copy
Edit
cd frontend
Install dependencies
bash
Copy
Edit
npm install
Configure environment variables:

Create a .env.local file in the root directory of the frontend.
Set up the following variables:
ini
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:3000
Run the frontend server

bash
Copy
Edit
npm run dev
📌 API Documentation
1. POST /auth/signup
Description: Register a new user.
Body:
json
Copy
Edit
{
  "email": "user@example.com",
  "password": "password123",
  "skills": "JavaScript, React",
  "interests": "Volunteer, Community Support"
}
Response:
json
Copy
Edit
{
  "message": "User successfully registered."
}
2. POST /auth/login
Description: Log in a user.
Body:
json
Copy
Edit
{
  "email": "user@example.com",
  "password": "password123"
}
Response:
json
Copy
Edit
{
  "access_token": "jwt-token",
  "email": "user@example.com"
}
3. POST /events/create
Description: Create a new volunteer event.
Body:
json
Copy
Edit
{
  "title": "Food Drive",
  "description": "Help us collect food for those in need.",
  "location": "New York",
  "date": "2025-05-01"
}
Response:
json
Copy
Edit
{
  "message": "Event successfully created."
}
4. GET /events
Description: Get a list of all events.
Response:
json
Copy
Edit
[
  {
    "id": 1,
    "title": "Food Drive",
    "location": "New York",
    "date": "2025-05-01",
    "description": "Help us collect food for those in need."
  },
  ...
]
5. POST /help/request
Description: Create a new help request.
Body:
json
Copy
Edit
{
  "description": "Need volunteers for weekly tutoring",
  "urgency": "medium"
}
Response:
json
Copy
Edit
{
  "message": "Help request successfully posted."
}
📌 Running the Project
Locally:
Follow the setup instructions above for both backend and frontend.
Start the backend and frontend servers.
Visit http://localhost:3000 to use the platform locally.
In Production:
Set up your backend and frontend on a server.
Configure environment variables for the production environment.
Ensure your PostgreSQL database is running and accessible.
Deploy using a service like Heroku, AWS, or DigitalOcean.
📌 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

markdown
Copy
Edit

### Key Points:
- **Features** section lists all the key functionality.
- **Database Schema** is a simple table view of your key tables.
- **Setup Instructions** provide a step-by-step guide to getting the app running locally.
- **API Documentation** covers the essential endpoints and expected responses.
