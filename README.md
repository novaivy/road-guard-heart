# Road Guard Heart

Road Guard Heart is a road-safety support platform designed to help users access important safety information and resources in one place. The application provides a modern, responsive interface focused on promoting safer travel, awareness, and responsible road use.

## Live Demo

[View the live application](https://road-guard-heart.vercel.app/)

## Features

* Responsive and user-friendly interface
* Road-safety awareness content
* Easy navigation between application sections
* Modern reusable UI components
* Cloud-backed data and authentication support through Supabase
* Mobile-friendly design for access on different devices

## Tech Stack

* **React** — Frontend user interface
* **TypeScript** — Type-safe application development
* **Vite** — Fast development server and build tool
* **Tailwind CSS** — Utility-first styling
* **shadcn/ui** — Reusable UI components
* **Supabase** — Backend services, database, and authentication support
* **Vitest** — Testing configuration

## Project Structure

```text
road-guard-heart/
│
├── public/                 # Static assets
├── src/                    # Application source code
│   ├── components/         # Reusable UI components
│   ├── pages/              # Application pages
│   ├── integrations/       # External service integrations
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
│
├── supabase/               # Supabase configuration and migrations
├── package.json            # Project dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

* Node.js
* npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/novaivy/road-guard-heart.git
cd road-guard-heart
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

The application will be available on the local address shown in your terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev       # Starts the development server
npm run build     # Builds the app for production
npm run preview   # Previews the production build locally
npm run test      # Runs tests, if configured
```

## Deployment

This project can be deployed using Vercel.

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Create a new project and import this repository.
4. Add the required Supabase environment variables.
5. Deploy the application.

## Future Improvements

* Add emergency contact and reporting features
* Add real-time road incident alerts
* Add location-based safety guidance
* Add user accounts and personalized dashboards
* Add a map for identifying accident-prone areas
* Add educational road-safety articles and campaigns

## Author

**Nova Ivy**

* GitHub: https://github.com/novaivy
* Repository: https://github.com/novaivy/road-guard-heart

## License

This project is available for learning, portfolio, and development purposes.
