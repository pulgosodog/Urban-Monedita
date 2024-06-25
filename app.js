const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
res.render('index.ejs');
});

app.listen(port, ()=>{
console.log('On localhost 3000')
});