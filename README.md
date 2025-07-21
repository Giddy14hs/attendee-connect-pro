# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3fa2824d-95aa-4dbe-984a-6c179d73d84c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3fa2824d-95aa-4dbe-984a-6c179d73d84c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3fa2824d-95aa-4dbe-984a-6c179d73d84c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

# Attendee Connect Pro

A comprehensive event registration and management system built with React, TypeScript, and PHP.

## Features

- **User Authentication**: Login and signup functionality
- **Event Management**: Create, edit, and manage events
- **Event Discovery**: Browse and search events from Eventbrite API
- **Ticket Purchasing**: Complete ticket purchase flow
- **Registration System**: Link users to events they register for
- **Dashboard**: View recommended and other events

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a MySQL database named `eventregistration`
2. Import the database schema:
   ```bash
   mysql -u root -p eventregistration < api/setup_database.sql
   ```

### 3. Eventbrite API Setup (Optional)

To display real events on the dashboard:

1. Get an Eventbrite API token from [Eventbrite Platform](https://www.eventbrite.com/platform/api-keys)
2. Create a `.env` file in the root directory:
   ```
   VITE_EVENTBRITE_TOKEN=your_eventbrite_private_token_here
   ```

**Note**: If no Eventbrite token is provided, the dashboard will show fallback sample events.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## API Endpoints

### User Management
- `POST /api/user_api.php` - User registration, login, and event registration

### Event Management  
- `POST /api/event_api.php` - Create, update, and manage events
- `GET /api/search_events.php` - Search events

## Data Flow

1. **User Registration/Login**: Data sent to `/api/user_api.php` and stored in database
2. **Event Creation**: Organizers create events via `/api/event_api.php`
3. **Event Registration**: Users register for events, linking them in the database
4. **Event Discovery**: Dashboard fetches events from Eventbrite API or local database

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── services/       # API services (Eventbrite)
│   └── hooks/          # Custom React hooks
├── api/                # PHP backend APIs
│   ├── user_api.php    # User management
│   ├── event_api.php   # Event management
│   └── config.php      # Database configuration
└── public/             # Static assets
```
