import express from 'express';
import bodyParser from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { getViajes, addViaje, editViaje, deleteViaje, getViajesFormData,getViajesByConductor, getConductores, getVehiculos, addVehiculo, deleteVehiculo, editVehiculo, getRutas, addRuta, updateRuta, deleteRuta, updateConductor, deleteConductor, addConductor, connectToDatabase } from './mssqlConnect.js';

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

app.get('/viajes', async (req, res) => {
    try {
        console.log("Viajes listados!");
        const viajes = await getViajes(); // Function to fetch viajes from the database
        res.render("viajes.ejs", { title: 'Viajes', viajes: viajes });
    } catch (err) {
        res.status(500).send('Error retrieving viajes');
    }
});

app.post('/viajes/add', async (req, res) => {
    console.log("Form viaje:", req.body);
    try {
        await addViaje(req.body); // Function to add a new viaje to the database
        console.log('New viaje added!');
        res.redirect('/viajes');
    } catch (err) {
        console.error('Error in POST /viajes/add:', err);
        res.status(500).send('Error adding viaje');
    }
});

app.get('/viajes/add-data', async (req, res) => {
    try {
        const formData = await getViajesFormData();
        res.json(formData);
    } catch (err) {
        res.status(500).send('Error retrieving data');
    }
});

app.post('/viajes/edit/:id', async (req, res) => {
    const { id } = req.params;
    const updatedViajeData = req.body;
    console.log("Route history, data gotten: ",updatedViajeData);
    try {
        await editViaje(id, updatedViajeData); // Function to update viaje in the database
        console.log('Updated viaje data');
        res.redirect('/viajes');
    } catch (err) {
        res.status(500).send('Error updating viaje');
    }
});

app.delete('/viajes/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await deleteViaje(id); // Function to delete a viaje from the database
        console.log('Viaje deleted successfully');
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error deleting viaje');
    }
});

app.get('/viajes/:licencia', async (req, res) => {
    const { licencia } = req.params;

    try {
        const viajes = await getViajesByConductor(licencia); // Call function to fetch viajes from the database
        res.render('viajes', { viajes }); // Render viajes page with the retrieved data
    } catch (err) {
        console.error('Error fetching viajes:', err);
        res.status(500).send('Error fetching viajes'); // Handle error
    }
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

app.post('/conductores/add', async (req, res) => {
    console.log(req.body);
    const newDriverData = req.body;

    console.log('Received POST data:', newDriverData);

    try {
        await addConductor(newDriverData);

        // // Log the new data to the server terminal
        console.log('New Conductor Data:');
        console.log(newDriverData);

        // Redirect to /conductores after successful insert
        res.redirect('/conductores');
    } catch (err) {
        console.error('Error adding conductor:', err);
        res.status(500).send('Error adding conductor');
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

app.post('/conductores/delete/:licencia', async (req, res) => {
    const { licencia } = req.params;

    try {
        await deleteConductor(licencia);
        console.log(`Conductor with Licencia ${licencia} deleted successfully`);
        res.status(200).send({ message: 'Conductor deleted successfully' });
    } catch (err) {
        console.error("Error deleting conductor: ", err);
        res.status(500).send({ message: 'Error deleting conductor' });
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

app.post('/vehiculos/add', async (req, res) => {
    console.log("Form vehiculo:", req.body)
    try {
        await addVehiculo(req.body);
        console.log('New vehiculo data!');
        res.redirect('/vehiculos');
    } catch (err) {
        console.error('Error in POST /vehiculos/add:', err);
        res.status(500).send('Error sending data');
    }
});

app.post('/vehiculos/edit/:matricula', async (req, res) => {
    const { matricula } = req.params;
    const updatedVehiculoData = req.body;

    try {
        await editVehiculo(matricula, updatedVehiculoData);
        console.log('Updated vehiculo data');
        res.redirect('/vehiculos');
    } catch (err) {
        res.status(500).send('Error updating vehiculo');
    }
});

app.delete('/vehiculos/delete/:matricula', async (req, res) => {
    const { matricula } = req.params;
    try {
        await deleteVehiculo(matricula);
        console.log('Vehiculo deleted successfully');
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error deleting vehiculo');
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

app.post('/rutas/edit/:IDRuta', async (req, res) => {
    const { IDRuta } = req.params;
    const { Origen, Destino, Distancia, DuracionEstimada } = req.body;

    try {
        await updateRuta(IDRuta, Origen, Destino, Distancia, DuracionEstimada);
        res.redirect('/rutas'); // Redirect to route listing after successful update
    } catch (error) {
        console.error('Error updating ruta:', error);
        res.status(500).send('Error updating ruta');
    }
});

app.post('/rutas/add', async (req, res) => {

    console.log("Form ruta:", req.body)
    try {
        await addRuta(req.body);
        console.log('New ruta data!');
        res.redirect('/rutas');
    } catch (err) {

    }
});

app.delete('/rutas/delete/:IDRuta', async (req, res) => {
    const { IDRuta } = req.params;

    try {
        await deleteRuta(IDRuta);
        res.sendStatus(200); // Send success status after deletion
    } catch (error) {
        console.error('Error deleting ruta:', error);
        res.status(500).send('Error deleting ruta');
    }
});

app.listen(port, () => {
    console.log('On localhost 3000')
});