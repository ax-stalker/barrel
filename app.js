const express = require('express');
const app = express();
const path = require("path");
const publicDir = path.join(__dirname, './public');

// Set view engine
app.set('view engine', 'hbs');

// Serve static files
app.use(express.static(publicDir));

// Middleware for parsing JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
// const dashboardRoutes = require('./routes/dashboard');

// Use routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/", authRoutes);
// app.use("/dashboard", dashboardRoutes);

// ... (your other middleware and configurations go here)

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
