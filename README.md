# Montgomery Blair Go Tournament

A modern, fully responsive Next.js application with Tailwind CSS for managing Go tournaments.

## Features

- 🎨 Modern, responsive design with Tailwind CSS
- ⚡ Built with Next.js 14 (App Router)
- 📱 Fully responsive across all devices
- 🎯 TypeScript for type safety
- 🚀 Optimized for performance

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles with Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Navbar.tsx       # Navigation component
│   ├── Footer.tsx       # Footer component
│   ├── Hero.tsx         # Hero section
│   ├── Features.tsx     # Features section
│   ├── Stats.tsx        # Statistics section
│   └── CTA.tsx          # Call-to-action section
├── tailwind.config.js   # Tailwind configuration
├── next.config.js       # Next.js configuration
└── package.json         # Dependencies
```

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **PostCSS** - CSS processing

## License

MIT
