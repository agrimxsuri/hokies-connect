# Hokies Connect

A Virginia Tech alumni networking platform that connects current students with alumni for mentorship, career guidance, and professional opportunities.

## Deploy on Vercel

*Frontend:* Vite + React (TypeScript)  
*Output:* ⁠ dist ⁠  
*Routing:* SPA rewrite via ⁠ vercel.json ⁠

### One-time
1.⁠ ⁠Push to GitHub.
2.⁠ ⁠In Vercel: *Add New Project → Import this repo*.
3.⁠ ⁠Framework preset: *Vite*  
   Build Command: ⁠ npm run build ⁠  
   Output Directory: ⁠ dist ⁠
4.⁠ ⁠Add Environment Variables from ⁠ .env.example ⁠ for *Preview* and *Production*.

### CLI (optional)
```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

## Features

- **Student Profiles**: Create comprehensive academic profiles with Hokie Journey tracking
- **Alumni Profiles**: Share complete Virginia Tech experience and professional journey
- **AI-Powered Matching**: Intelligent matching between students and alumni based on shared interests, majors, and career goals
- **Mentorship Platform**: Connect students with relevant alumni mentors
- **Event Management**: Schedule and manage mentorship sessions

## Technologies

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - Modern UI library
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hokies-connect
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.