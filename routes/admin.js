const express = require('express');
const router = express.Router();
const db = require('../database');

// Render the admin page
router.get('/admin', (req, res) => {
    // Fetch users from the database (replace with your actual query)
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) throw err;
  
      // Render the admin page with the fetched users
      res.render('admin', { users: results });
    });
  });

  // Function to retrieve users from the database
const getUsers = (callback) => {
    db.query('SELECT * FROM users', (error, results) => {
        callback(error, results);
    });
};

// Display users route (reuse getUsers function)
router.get("/displayUsers", (req, res) => {
    getUsers((error, results) => {
        if (error) {
            console.error(error);
            res.status(500).render('admin', { message: 'Error fetching users' });
        } else {
            res.render('admin', { users: results });
        }
    });
});

// Deleting a member
router.post("/deleteUser", (req, res) => {
    const userId = req.body.userId;

    // Implement logic to delete the user from the database
    db.query('DELETE FROM users WHERE id = ?', [userId], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Error deleting user' });
        } else {
            res.json({ success: true, message: 'User deleted successfully' });
        }
    });
});
  module.exports = router;







