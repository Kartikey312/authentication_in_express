const express = require('express');
const bodyParser = require('body-parser');
const jwd = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret
const app = express();
app.use(express.json());

// Dummy users array for demonstration
const users = [];

// Dummy token generator
function generateToken() {
    return Math.random().toString(36).substr(2);
}

app.post('/signup', function(req, res) {
    const { username, password } = req.body;
    // Check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).send({ message: 'User already exists' });
    }
    users.push({
        username: username,
        password: password
    });
    res.send({ message: 'User signed up successfully' });
});
app.post('/signin', function(req, res) {
    const { username, password } = req.body;
    const founduser = users.find(user => user.username === username && user.password === password);
    if (founduser) {
        const token = jwd.sign({ username: founduser.username },JWT_SECRET);     
        //    founduser.token = token; // Assign token to user
        res.send({ token }); // <-- Always send a response!
    } else {
        res.status(403).send({ message: 'Invalid username or password' });
    }
    console.log(users); // Log users array to see the current state
});
app.get("/me", (req, res) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).send({ message: "No token provided" });
    }
    try {
        const decodedInformation = jwd.verify(token, JWT_SECRET);
        const user = users.find(user => user.username === decodedInformation.username);
        if (user) {
            res.send({ username: user.username });
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    } catch (err) {
        res.status(401).send({ message: "Invalid token" });
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});