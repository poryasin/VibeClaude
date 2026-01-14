# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VibeClaude is a Node.js web application built with Express. It serves a static frontend with a basic API backend.

## Development Commands

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start          # Start the production server
npm run dev        # Start development server with auto-reload (uses nodemon)
```

### Testing
```bash
npm test           # Run tests (currently not configured)
```

## Architecture

### Server Structure
- **Entry Point**: `index.js` - Express server setup and configuration
- **Static Files**: `public/` directory contains frontend assets (HTML, CSS, JavaScript)
- **Port**: Defaults to 3000, configurable via `PORT` environment variable

### Key Components

**Express Server (index.js)**
- Serves static files from `public/` directory
- Provides JSON API endpoints
- Includes health check endpoint at `/api/health`
- Configured with JSON body parser middleware

**Frontend (public/)**
- `index.html` - Main HTML entry point
- `styles.css` - Application styles
- `app.js` - Client-side JavaScript that communicates with the API

### Adding New Features

**New API Routes**: Add routes in `index.js` before the `app.listen()` call
```javascript
app.get('/api/your-route', (req, res) => {
  // your logic here
});
```

**New Static Pages**: Add HTML files to `public/` directory, accessible at `/filename.html`

**Environment Variables**: Create a `.env` file (already in .gitignore) for sensitive configuration

## Project Dependencies

- **express**: Web framework
- **nodemon**: Development tool for auto-restart on file changes (dev dependency)
