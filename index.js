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

// * Code for Route 1 goes here
app.get('/homepage-players', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=player_name,player_country,player_team';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        const players = response.data.results; // Extract players 
        res.render('homepage', { title: 'Players List | HubSpot API', players }); // Pass data 
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching players');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/update-players', (req, res) => {
    res.render('updates', { title: 'Update Player | HubSpot API' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-players', async (req, res) => {
    const newPlayer = {
        properties: {
            player_name: req.body.player_name,
            player_country: req.body.player_country,
            player_team: req.body.player_team
        }
    };

    const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));