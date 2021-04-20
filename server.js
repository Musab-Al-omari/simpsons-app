'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }))
// Specify a directory for static resources
app.use(express.static('./public'));
// define our method-override reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine', 'ejs');
// Use app cors
app.use(cors());


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
app.get('/', homePage)
app.post('/', saveInData)
app.get('/favorite-quotes', favoriteQuotes)
app.get('/favorite-quotes/:quote_id', detailQoute)
app.delete('/favorite-quotes/:quote_id', deleteQoute)
app.put('/favorite-quotes/:quote_id', putQoute)


// callback functions
function homePage(request, response) {
    let url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
    superagent.get(url).set('User-Agent', '1.0').then(result => {
        // console.log(result.body);
        response.render('index', { homePageArray: result.body })
    })

}

function saveInData(request, response) {
    const { image, character, quote, characterDirection } = request.body
    let values = [image, character, quote, characterDirection]
    let sql = 'INSERT INTO sim (image1, character1, quote,characterDirection) VALUES ($1,$2,$3,$4);'

    client.query(sql, values).then(() => {
        response.redirect('/favorite-quotes')
    })
}

function favoriteQuotes(request, response) {

    let sql = 'SELECT * FROM sim;'
    client.query(sql).then(result => {
        console.log(result.rows);
        response.render('favorite-quotes', { myFavor: result.rows })
    })

}

function detailQoute(request, response) {
    let sql = 'SELECT * FROM sim WHERE id=$1'
    let id = request.params.quote_id
    // console.log(id);
    client.query(sql, [id]).then(result => {
        // console.log(result.rows[0]);
        response.render('detailPage', { element: result.rows[0] })
    })

}

function deleteQoute(request, response) {

    let sql = 'DELETE FROM sim WHERE id=$1'
    let id = request.params.quote_id
    client.query(sql, [id]).then( ()=> {
        
        response.redirect('/favorite-quotes')
    })
}

function putQoute(request, response) {

    let id = request.params.quote_id
    const { image, character, quote, characterDirection } = request.body
    let values = [image, character, quote, characterDirection,id]
    let sql='UPDATE sim SET image1 = $1, character1 = $2,  quote = $3, characterDirection = $4 WHERE id=$5;'
    client.query(sql,values).then(()=>{
        response.redirect(`/favorite-quotes/${id}`)
    })
    
}











// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
