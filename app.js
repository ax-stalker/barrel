const express = require('express');

// const dotenv = require('dotenv')
// dotenv.config({ path: './.env'})
const app = express();
// specifiying the view engine
app.set('view engine', 'hbs')

// other imports
const path = require("path")

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))


// route to render index page
app.get("/", (req, res) => {
    res.render("index")
})


app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/dashboard", (req, res)=> {
    res.render("dashboard")
})

// app.get("/admin", (req, res)=> {
//     res.render("admin")
// })




// user authentication
const bcrypt = require("bcryptjs")
const db =require('./database');
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

// retrieving form values
app.post("/auth/register", (req, res) => {    
    const { name, email, password, password_confirm } = req.body

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
        if(error){
            console.log(error)
        }

        if( result.length > 0 ) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        } else if(password !== password_confirm) {
            return res.render('register', {
                // message: 'Password Didn\'t Match!'
                message: `${password} and ${password_confirm} do not match`
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8)

        console.log(`${name} registered `)
       
        db.query('INSERT INTO users SET?', {name: name, email: email, password: hashedPassword}, (err, result) => {
            if(err) {
                console.log(error)
            } else {
                return res.render('dashboard', {
                    message: 'User registered!'
                })
            }
        })        
    })
})




// user login
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Check if the user with the given email exists
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

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, results[0].password);

        if (!isPasswordValid) {
            return res.render('login', {
                message: 'Invalid password'
            });
        }

        // If the email and password are valid, you can set a session or JWT token to track the user's authentication status.
        // For simplicity, let's just redirect to a dashboard page.
         res.render('admin',{
            message: "login successful"
         });
    });
});

// ...

// admin dashboard
// Render the admin dashboard with the list of users
app.get("/admin", (req, res) => {
    // Retrieve the list of users from your database (replace this with your actual logic)
    db.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.log(error);
            return res.render('admin', {
                message: 'Internal server error'
            });
        }

        res.render("admin", {
            users: results
        });
    });
});

// Endpoint to handle user deletion
app.post('/delete/user/:id', (req, res) => {
    const userId = req.params.id;
    
    // Implement logic to delete the user with the specified ID from your database
    db.query('DELETE FROM users WHERE id = ?', [userId], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'User deleted successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    });
});






app.listen(5000, ()=> {
    console.log("server started on port 5000")
})
