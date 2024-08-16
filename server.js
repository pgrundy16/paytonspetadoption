const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

const usersFile = path.join(__dirname, 'data', 'users.json');
const petsFile = path.join(__dirname, 'data', 'pets.json');
const counterFile = path.join(__dirname, 'data', 'counter.json');

// Serve static files (like CSS and images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Add session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Middleware to make session data available in all views
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/pets', (req, res) => {
  res.render('pets');
});

app.get('/find', (req, res) => {
  res.render('find');
});

app.get('/give', (req, res) => {
  res.render('give');
});

app.get('/dogcare', (req, res) => {
  res.render('dogcare');
});

app.get('/catcare', (req, res) => {
  res.render('catcare');
});

app.get('/createAccount', (req, res) => {
    res.render('createAccount');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ success: false, message: 'Error logging out.' });
        }
        res.redirect('/'); // Redirect to homepage or login page after logout
    });
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/path/to/pets.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'pets.json'));
});

app.post('/createAccount', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            return res.json({ success: false, message: 'Error reading user data.' });
        }

        const users = data ? JSON.parse(data) : {};

        // Check if the username already exists
        if (users.hasOwnProperty(username)) {
            return res.json({ success: false, message: 'Username already exists.' });
        }

        // Add the new user to the object and save it
        users[username] = password;

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.json({ success: false, message: 'Error saving user data.' });
            }

            res.json({ success: true });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFile, 'utf8', (err, data) => {
        if (err) {
            return res.json({ success: false, message: 'Error reading user data.' });
        }

        const users = JSON.parse(data);
        if (users[username] === password) {
            req.session.loggedIn = true;
            req.session.username = username;
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid username or password.' });
        }
    });
});

app.post('/give', (req, res) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }

    // Read and update counter
    fs.readFile(counterFile, 'utf8', (err, counterData) => {
        if (err) {
            return res.json({ success: false, message: 'Error reading counter data.' });
        }

        const counter = JSON.parse(counterData);
        const newID = counter.currentID + 1;
        
        // Update counter value
        counter.currentID = newID;
        
        fs.writeFile(counterFile, JSON.stringify(counter, null, 2), err => {
            if (err) {
                return res.json({ success: false, message: 'Error updating counter data.' });
            }

            const newPet = {
                id: newID,
                usernameRegistered: req.session.username,
                petType: req.body.pettype,
                breed: req.body.breed,
                age: parseInt(req.body.age),
                gender: req.body.gender,
                getsAlongWithDogs: req.body.getsalongdogs,
                getsAlongWithCats: req.body.getsalongcats,
                suitableForChildren: req.body.suitablechildren,
                comments: req.body.comments,
                name: req.body.name,
                ownerName: req.body.ownername,
                ownerEmail: req.body.owneremail
            };

            // Create formatted string for new pet
            const petString = [
                newPet.id,
                newPet.usernameRegistered,
                newPet.petType,
                newPet.breed,
                newPet.age,
                newPet.gender,
                newPet.getsAlongWithDogs,
                newPet.getsAlongWithCats,
                newPet.suitableForChildren,
                newPet.comments,
                newPet.name,
                newPet.ownerName,
                newPet.ownerEmail
            ].join(':');

            fs.readFile(petsFile, 'utf8', (err, data) => {
                if (err) {
                    return res.json({ success: false, message: 'Error reading pet data.' });
                }

                const pets = data ? JSON.parse(data) : [];
                pets.push(petString);

                fs.writeFile(petsFile, JSON.stringify(pets, null, 2), err => {
                    if (err) {
                        return res.json({ success: false, message: 'Error saving pet data.' });
                    }

                    res.json({ success: true, message: 'Pet information submitted successfully!' });
                });
            });
        });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});