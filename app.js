const express = require('express');
const app = express();

// Set port to environment variable or fallback to 10000 for local dev
const PORT = process.env.PORT || 10000;

// Middleware for JSON request bodies
app.use(express.json());

// Define your POST endpoint
app.post('/api/generate-script', (req, res) => {
  // Your endpoint logic here
  res.json({ success: true });
});

// Bind explicitly to 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
