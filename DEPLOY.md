
# Deployment Instructions

## Building and Running Locally

To build and run the application locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Build the application:
   ```
   npm run build
   ```

3. Start the server:
   ```
   node start-server.js
   ```

## Deploying to Render

1. Connect your GitHub repository to Render.

2. Create a new Web Service with the following settings:
   - Build Command: `npm run build`
   - Start Command: `node start-server.js`

3. Add the following environment variables:
   - `PORT`: (Leave blank, Render will provide this automatically)
   - `NODE_ENV`: `production`

4. Deploy the application and wait for the build to complete.

## Important Notes

- The application is configured to serve static files from the `dist` directory.
- For SPA routing, all requests that don't match a file will serve index.html.
- The server handles common content types and sets appropriate headers.
- The port is configured to use Render's provided PORT environment variable, or defaults to 8080 locally.
