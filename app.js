import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConductores, getVehiculos, getRutas, connectToDatabase } from './mssqlConnect.js';

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
    res.render("viaje.ejs", { title: 'Viajes' });
});

app.get('/ingresos', (req, res) => {
    res.render('ingresos.ejs', { title: 'Ingresos' });
});
app.get('/conductores', async (req, res) => {
    try {
        const conductores = await getConductores();
        res.render("conductores.ejs", { title: 'Conductores', conductores: conductores })
    } catch (err) {
        res.status(500).send('Error retrieving Conductores');
    }
});

app.get('/vehiculos', async (req, res) => {
    try {
        const vehiculos = await getVehiculos();
        console.log(vehiculos);
        res.render("vehiculos.ejs", { title: 'vehiculos', vehiculos: vehiculos })
    } catch (err) {
        res.status(500).send('Error retrieving Vehiculos');
    }
});

app.get('/rutas', async (req, res) => {
    try {
        const rutas = await getRutas();
        console.log(rutas);
        res.render("rutas.ejs", { title: 'rutas', rutas: rutas })
    } catch (err) {
        res.status(500).send('Error retrieving Rutas');
    }
});

app.listen(port, () => {
    console.log('On localhost 3000')
});