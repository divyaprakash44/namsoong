const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'your-super-secret-key-change-this!'; // Change this in production!
const SALT_ROUNDS = 10;

// --- Middleware ---
app.use(cors());
app.use(bodyParser.json());

// --- In-Memory Database (Replace with your DB) ---
// DB_TODO: Replace this with your PostgreSQL or MongoDB user model
const users = []; // e.g., { id: 1, name: 'Test User', email: 'test@test.com', passwordHash: '...' }

// --- Authentication Middleware (v2 Plan) ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <TOKEN>"

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided.' });
  }

  try {
    // Verify the token
    const verifiedUser = jwt.verify(token, JWT_SECRET);
    req.user = verifiedUser; // Add user payload to the request object
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// --- ================== ---
// --- Authentication Routes ---
// --- ================== ---

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // DB_TODO: Replace this check with a database query
    // 2. Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // DB_TODO: Replace this with a database `INSERT`
    // 4. Create new user
    const newUser = {
      id: users.length + 1, // Simple auto-incrementing ID
      name,
      email,
      passwordHash, // Store the hash, NOT the password
    };
    users.push(newUser);
    console.log('New user registered:', newUser);

    // 5. Create a JWT token
    const tokenPayload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    // 6. Send response
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // DB_TODO: Replace this check with a database query
    // 2. Find the user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 3. Compare password with the hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // 4. Create and send token
    const tokenPayload = { id: user.id, email: user.email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- ================== ---
// --- App Core Routes ---
// --- ================== ---

/**
 * @route   POST /api/export/queue
 * @desc    Accepts highlight data and queues it for PDF compilation
 * @access  Private (Requires Token)
 */
app.post('/api/export/queue', verifyToken, (req, res) => {
  // At this point, `verifyToken` middleware has run successfully.
  // We have access to the user's info in `req.user`.
  console.log(`Received export request from user: ${req.user.email}`);

  const { highlights } = req.body; // Expects a JSON payload like { "highlights": [...] }

  if (!highlights || !Array.isArray(highlights)) {
    return res.status(400).json({ message: 'Invalid payload. "highlights" array is required.' });
  }

  // --- Asynchronous Processing (v2 Plan) ---
  // This is where you add the job to your Redis queue.
  // The Python/Celery worker will pick it up from here.

  // 1. TODO: Add job to Redis queue
  // e.g., redisClient.lpush('export_jobs', JSON.stringify({ userId: req.user.id, highlights }));

  console.log(`Queuing export job for ${req.user.email} with ${highlights.length} highlights.`);

  // 2. Immediately respond to the client
  // This makes the app feel fast.
  res.status(202).json({
    message: 'Export job accepted. Your file is being processed and will be available shortly.',
  });
});


// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Inscribe API Gateway running on http://localhost:${PORT}`);
});
