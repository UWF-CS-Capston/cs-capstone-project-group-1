Capstone Project: GymBuddy

To run app:

1) cd GymBuddy
2) npm start 

\/ SHIT THAT MIGHT NOT BE NEEDED \/

Backend (Express API with PostgreSQL):

1) Install backend dependencies:
	- cd Backend
	- npm install

2) Install GymBuddy dependencies (contains API source files):
	- cd ../GymBuddy
	- npm install

3) Create PostgreSQL database:
	- Example: CREATE DATABASE gymbuddy;

4) Create backend environment file:
	- cd ../Backend
	- copy .env.example .env
	- update JWT_SECRET and database credentials

5) Initialize database schema:
	- psql -U postgres -d gymbuddy -f sql/init.sql

6) Start backend API:
	- npm run dev

Auth endpoints:

- POST /api/auth/register
- POST /api/auth/login
