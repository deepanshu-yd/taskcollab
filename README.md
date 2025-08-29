# TaskCollab

A modern task management application built with Next.js, TypeScript, and PostgreSQL. Manage your tasks efficiently with a clean, intuitive interface.

## Features

- Google OAuth authentication
- Create, read, update, and delete tasks
- Mark tasks as completed
- Real-time task statistics
- Responsive design for all devices
- Secure user data with Prisma and PostgreSQL

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd taskcollab
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How to Use

### Getting Started
1. Visit the homepage
2. Click "Get Started with Google" to sign in with your Google account
3. You'll be redirected to your personal dashboard

### Managing Tasks
- **Add Task**: Type your task in the input field and click "Add Task"
- **Complete Task**: Check the checkbox next to any task to mark it as completed
- **Delete Task**: Click the trash icon to permanently remove a task
- **View Stats**: See your total tasks, completed tasks, and pending tasks at the top

### Account Management
- Click "Logout" in the top right corner to sign out
- Your tasks are automatically saved and will be there when you return

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, TailwindCSS
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Database Schema

The app uses two main models:
- **User**: Stores user information from Google OAuth
- **Task**: Stores tasks linked to each user

## API Endpoints

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/[id]` - Update a task (title or completion status)
- `DELETE /api/tasks/[id]` - Delete a task

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
