# VibeClaude

A Node.js web application built with Express.

## Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development Mode

For development with auto-reload (requires nodemon):

```bash
npm run dev
```

## Project Structure

```
VibeClaude/
├── index.js          # Main server file
├── public/           # Static files (HTML, CSS, JS)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Serve the main application
- `GET /api/health` - Health check endpoint

## License

ISC
