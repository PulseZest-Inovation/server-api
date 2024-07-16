const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001; // Your server port

// Initialize Razorpay with your key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware configuration
app.use(cors({
  origin: 'https://next-js-pay.vercel.app', // Allow requests from this origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allow these methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  credentials: true // Allow cookies to be sent with requests
}));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Razorpay API server!');
});

// Route to create a Razorpay order
app.post('/api/createOrder', async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    // Create order using Razorpay API
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes,
    });

    // Send the order details back to the client
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
