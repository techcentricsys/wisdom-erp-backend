# Full-Stack Application: React, Vite, TypeScript, NestJS, and Prisma

A modern full-stack web application featuring a high-performance React + Vite frontend and a robust NestJS backend powered by Prisma ORM and PostgreSQL.

## Tech Stack

* **Frontend:** React, TypeScript, Vite, HTML5, CSS3 / Modern Styling
* **Backend:** NestJS, TypeScript, Node.js
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Version Control:** Git

---

## Project Structure

```text
├── client/                 # React + Vite frontend application
│   ├── src/                # Frontend source code (components, pages, styles)
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies and scripts
│
├── server/                 # NestJS backend application
│   ├── src/                # Backend source code (modules, controllers, services)
│   ├── prisma/             # Database schema and migration files
│   └── package.json        # Backend dependencies and scripts
│
└── README.md

```

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

* Node.js (LTS version recommended)
* npm or yarn
* PostgreSQL database instance

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

```

### 2. Set Up the Backend (NestJS & Prisma)

Navigate to the server directory, install dependencies, and configure your environment:

```bash
cd server
npm install

```

Create a `.env` file in the `server` directory and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
PORT=3000

```

Run database migrations to set up your Prisma schema:

```bash
npx prisma migrate dev --name init

```

Start the backend development server:

```bash
npm run start:dev

```

### 3. Set Up the Frontend (React & Vite)

Open a new terminal window, navigate to the client directory, and install dependencies:

```bash
cd client
npm install

```

Start the frontend development server:

```bash
npm run dev

```

The application will be running locally, with the frontend typically accessible at `http://localhost:5173` and the backend API running at `http://localhost:3000`.

---

## Database Management

To view and manage your database records visually using Prisma Studio:

```bash
cd server
npx prisma studio

```
