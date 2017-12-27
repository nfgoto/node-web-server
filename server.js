const express = require('express');
const hbs = require('hbs'); // handlebars view engine
const fs = require('fs');
var app = express();

// to set vars for express config
app.set('view engine', 'hbs'); // views directory is where Express looks for templates

hbs.registerPartials(__dirname + '/views/partials');


// handlebbars helper
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});


// handlebbars helper with params
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


// app.use() to register middleware: to tweak how express works
// next() is necessary to tell Express when middleware is done 
// so that other handlers can execute (async)
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now} : ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log');
            console.log(err.message);
        }
    })
    next();
})


app.use((req, res, next) => {
    res.render('maintenance.hbs');
    // because there is no next() the other handlers will not be executed
});


// '__dirname' stores the path to project directory
// This pattern allows us not to have to create a route for every page
//   :  serves all files in the directory mentionned
app.use(express.static(__dirname + '/public'));


// set up a handler for a HTTP GET request on the root route
app.get('/', (req, res) => {
    //res.send({name: 'toto',city: 'Luganda',race: 'Black'}); // objects automatically converted to JSON string
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to your first Express.js site'
    })
});


// GET handler for the aout route
app.get('/about', (req, res) => {
    // will render template with the set up view engine
    // passing data to be rendered with an object
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});


app.get('/bad', (req, res) => {
    res.send({
        error: {
            code: 404,
            message: 'Page not found'

        }
    })
});


// will bound the app to a port on our machine
app.listen(3000, () => {
    console.log('Server is up on port 3000');
});