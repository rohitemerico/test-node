# BioID Local Server

A local Node.js server that provides a web interface for BioID API verification, avoiding CORS issues by proxying requests through the local server.

## Features

- Web interface for BioID API verification
- Automatic detection of local IP address
- Client IP detection
- CORS-free API proxying
- Static file serving

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`. Open this URL in your browser to access the web interface.

## API Endpoints

- `GET /api/local-ip` - Returns the local IP address of the server
- `GET /api/client-ip` - Returns the client's IP address
- `POST /api/verify` - Proxies BioID verification requests

## Dependencies

- express: Web framework
- axios: HTTP client for API requests
- cors: Cross-origin resource sharing
- node-fetch: Fetch API for Node.js

## License

This project is licensed under the MIT License.