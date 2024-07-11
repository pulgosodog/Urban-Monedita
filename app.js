import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

//----------------------------------------------------------------

app.get('/', (req, res) => {
res.render('index.ejs');
});

app.get('/viajes', (req, res) => {
    res.render("viaje.ejs", {title:'Viajes'});
});

app.get('/ingresos', (req, res) => {
    res.render('ingresos.ejs',{title:'Ingresos'});
});
app.get('/conductores', (req, res) => {
    res.render("conductores.ejs", {title:'Conductores'});
});

app.listen(port, ()=>{
console.log('On localhost 3000')
});