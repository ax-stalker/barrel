const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database');

// Middleware for parsing form data
router.use(express.urlencoded({ extended: 'false' }));
router.use(express.json());

// route to render registration page
router.get("/register", (req, res) => {
    res.render("register");
});

// user registration
router.post("/auth/register", async (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            });
        } else if (password !== password_confirm) {
            return res.render('register', {
                message: `${password} and ${password_confirm} do not match`
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        console.log(`${name} registered `);

        // Insert the role along with other user details
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword, role: 'member' }, (err, result) => {
            if (err) {
                console.log(error);
            } else {
                return res.render('dashboard', {
                    message: 'User registered!'
                    
                });
            }
        });
    });
});


// route to render login page
router.get("/login", (req, res) => {
    res.render("login");
});

// user login
router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
            return res.render('login', {
                message: 'Internal server error'
            });
        }

        if (results.length === 0) {
            return res.render('login', {
                message: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, results[0].password);

        if (!isPasswordValid) {
            return res.render('login', {
                message: 'Invalid password'
            });
        }

        const userRole = results[0].role;

        if (userRole === 'admin') {
            res.render('admin', {
                message: "Login successful"
            });
        } else if (userRole === 'member') {
            res.render('dashboard', {
                message: "Login successful"
            });
        } else {
            // Handle unknown role
            res.render('login', {
                message: 'Unknown user role'
            });
        }
    });
});


module.exports = router;
