// Import required modules
const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const moment = require('moment');
const vverifyToken = require('../middlewares/middleware.js');

// Secret key for JWT (stored securely in environment variables)
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse JSON bodies
app.use(express.json());

const { verifyToken, checkRole } = vverifyToken;

// Database connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: "Z"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id', connection.threadId);
});


router.get('/validate-user/:uid', (req, res) => {
    const { uid } = req.params;
  
    const query = 'SELECT * FROM user WHERE uid = ?';
    connection.query(query, [uid], (err, results) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
        return;
      }
  
      if (results.length > 0) {
        res.json({ message: 'user_exists',
            "type" : results[0].type
         });
      } else {
        res.json({ message: 'please_sign_up',
         });
      }
    });
});

module.exports = router;
