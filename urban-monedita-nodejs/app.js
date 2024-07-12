import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getConductores, getVehiculos, getRutas, updateConductor, deleteConductor, connectToDatabase } from './mssqlConnect.js';

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
        console.log("Conductores listados!")
        res.render("conductores.ejs", { title: 'Conductores', conductores: conductores })
    } catch (err) {
        res.status(500).send('Error retrieving Conductores');
    }
});

app.post('/conductores/edit/:licencia', async (req, res) => {
    const licencia = req.params.licencia;
    const editedData = req.body;
  
    console.log('Received POST data:', editedData);
  
    try {
      await updateConductor(licencia, editedData);
  
      // Log the edited data to the server terminal
      console.log(`Edited Conductor ${licencia} Data:`);
      console.log(editedData);
  
      // Redirect to /conductores after successful update
      res.redirect('/conductores');
    } catch (err) {
      console.error('Error updating conductor:', err);
      res.status(500).send('Error updating conductor');
    }
  });

  app.post('/conductores/add', async (req, res) => {
    const newConductorData = req.body;
  
    console.log('Received POST data for new conductor:', newConductorData);
  
    try {
      await addConductor(newConductorData);
  
      // Log the new conductor data to the server terminal
      console.log('New Conductor Data:');
      console.log(newConductorData);
  
      // Redirect to /conductores after successful insertion
      res.redirect('/conductores');
    } catch (err) {
      console.error('Error adding new conductor:', err);
      res.status(500).send('Error adding new conductor');
    }
  });
  
  app.post('/conductores/delete/:licencia', async (req, res) => {
    const licencia = req.params.licencia;
  
    try {
      await deleteConductor(licencia);
  
      console.log(`Conductor with Licencia ${licencia} deleted successfully`);
  
      // Redirect to /conductores after successful delete
      res.redirect('/conductores');
    } catch (err) {
      console.error('Error deleting conductor:', err);
      res.status(500).send('Error deleting conductor');
    }
  });

app.get('/vehiculos', async (req, res) => {
    try {
        console.log("Vehiculos listados!")
        const vehiculos = await getVehiculos();
        res.render("vehiculos.ejs", { title: 'vehiculos', vehiculos: vehiculos })
    } catch (err) {
        res.status(500).send('Error retrieving Vehiculos');
    }
});

app.get('/rutas', async (req, res) => {
    try {
        const rutas = await getRutas();
        console.log("Rutas listadas!");
        res.render("rutas.ejs", { title: 'rutas', rutas: rutas })
    } catch (err) {
        res.status(500).send('Error retrieving Rutas');
    }
});

app.listen(port, () => {
    console.log('On localhost 3000')
});