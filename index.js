require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/players?properties=name,country,team';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const params = {
        properties: ['name', 'country', 'team'] // Add the property names you want here
    }
    try {
        const response = await axios.get(url, { headers, params });
        const players = response.data.results; // Extract players 
        res.render('homepage', { title: 'Players List | HubSpot API', players }); // Pass data 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching players');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const newPlayer = {
        properties: {
            name: req.body.name,
            country: req.body.country,
            team: req.body.team
        }
    };
    const url = 'https://api.hubapi.com/crm/v3/objects/players';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, newPlayer, { headers });
        res.redirect('/'); // Redirect back to homepage
    } catch (error) {
        console.error('Error creating player:', error.response?.data || error.message);
        res.status(500).send('Failed to create player.');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));