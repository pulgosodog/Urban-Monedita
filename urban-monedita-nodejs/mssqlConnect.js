import sql from 'mssql';

const config = {
    "user": "sa", // Database username
    "password": "admin", // Database password
    "server": "localhost", // Server IP address
    "database": "urban-monedita", // Database name
    "options": {
        trustedConnection: true, // Use Windows Authentication
        encrypt: true, // Enable encryption
        trustServerCertificate: true // Trust the server's self-signed certificate
    }
}

export async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log("Connected to SQL Server");
    } catch (err) {
        console.error("Database connection failed: ", err);
    }
}

export async function getViajes() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM Viajes");
        return result.recordset;
    } catch (err) {
        console.error("Error executing query: ", err);
        throw err;
    }
}

export async function addViaje(newViajeData) {
    console.log('Received newViajeData:', newViajeData);
    try {
        const pool = await sql.connect(config);
        const request = pool.request();
        
        request.input('IDConductor', sql.NVarChar, newViajeData.IDConductor);
        request.input('IDVehiculo', sql.NVarChar, newViajeData.IDVehiculo);
        request.input('IDRuta', sql.Int, newViajeData.IDRuta);
        request.input('HoraSalida', sql.VarChar, newViajeData.HoraSalida);
        request.input('HoraEntrada', sql.VarChar, newViajeData.HoraEntrada);
        request.input('Fecha', sql.Date, newViajeData.Fecha);
        request.input('IngresosGenerados', sql.Float, newViajeData.IngresosGenerados);
        request.input('ComentariosViaje', sql.Text, newViajeData.ComentariosViaje);

        const query = `
            INSERT INTO Viajes (IDConductor, IDVehiculo, IDRuta, HoraSalida, HoraEntrada, Fecha, IngresosGenerados, ComentariosViaje)
            VALUES (@IDConductor, @IDVehiculo, @IDRuta, @HoraSalida, @HoraEntrada, @Fecha, @IngresosGenerados, @ComentariosViaje)
        `;

        await request.query(query);
    } catch (err) {
        console.error('Error executing insert query:', err);
        throw err;
    }
}

export async function editViaje(idViaje, updatedViajeData) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('IDViaje', sql.Int, idViaje);
        request.input('IDConductor', sql.NVarChar, updatedViajeData.IDConductor);
        request.input('IDVehiculo', sql.NVarChar, updatedViajeData.IDVehiculo);
        request.input('IDRuta', sql.Int, updatedViajeData.IDRuta);
        request.input('HoraSalida', sql.VarChar, updatedViajeData.HoraSalida);
        request.input('HoraEntrada', sql.VarChar, updatedViajeData.HoraEntrada);
        request.input('Fecha', sql.Date, updatedViajeData.Fecha);
        request.input('IngresosGenerados', sql.Float, updatedViajeData.IngresosGenerados);
        request.input('ComentariosViaje', sql.Text, updatedViajeData.ComentariosViaje);

        const query = `
            UPDATE Viajes
            SET IDConductor = @IDConductor,
                IDVehiculo = @IDVehiculo,
                IDRuta = @IDRuta,
                HoraSalida = @HoraSalida,
                HoraEntrada = @HoraEntrada,
                Fecha = @Fecha,
                IngresosGenerados = @IngresosGenerados,
                ComentariosViaje = @ComentariosViaje
            WHERE IDViaje = @IDViaje
        `;

        await request.query(query);
    } catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

export async function deleteViaje(idViaje) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();
        request.input('IDViaje', sql.Int, idViaje);
        await request.query('DELETE FROM Viajes WHERE IDViaje = @IDViaje');
    } catch (err) {
        console.error('Error executing delete query:', err);
        throw err;
    }
}

export async function getViajesFormData() {
    try {
        const pool = await sql.connect(config);
        
        const vehiculosResult = await pool.request().query("SELECT Matricula FROM Vehiculos");
        const vehiculos = vehiculosResult.recordset.map(item => item.Matricula);
        
        const rutasResult = await pool.request().query("SELECT IDRuta, Origen, Destino FROM Rutas");
        const rutas = rutasResult.recordset.map(item => ({
            IDRuta: item.IDRuta,
            Origen: item.Origen,
            Destino: item.Destino
        }));
        
        const conductoresResult = await pool.request().query("SELECT Licencia FROM Conductores");
        const conductores = conductoresResult.recordset.map(item => item.Licencia);
        
        return { vehiculos, rutas, conductores };
    } catch (err) {
        console.error("Error retrieving data: ", err);
        throw err;
    }
}


export async function getConductores() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM conductores");
        return result.recordset;
    } catch (err) {
        console.error("Error executing query: ", err);
        throw err;
    }
}

export async function addConductor(newDriverData) {
    try {
        console.log('Received newDriverData:', newDriverData);

        const pool = await sql.connect(config);
        const request = pool.request();

        // Setting input parameters for the query
        request.input('Nombre', sql.VarChar, newDriverData.Nombre);
        request.input('Licencia', sql.VarChar, newDriverData.Licencia);
        request.input('Telefono', sql.VarChar, newDriverData.Telefono);
        request.input('Salario', sql.Int, newDriverData.Salario);
        request.input('FechaContratacion', sql.Date, newDriverData.FechaContratacion);
        request.input('Direccion', sql.VarChar, newDriverData.Direccion);

        // Constructing the SQL query
        const query = `
            INSERT INTO Conductores (Nombre, Licencia, Telefono, Salario, FechaContratacion, Direccion)
            VALUES (@Nombre, @Licencia, @Telefono, @Salario, @FechaContratacion, @Direccion)
        `;

        // Executing the insert query
        await request.query(query);

        console.log(`Conductor added successfully`);
    } catch (err) {
        console.error("Error executing insert query: ", err);
        throw err;
    }
}

export async function updateConductor(licencia, editedData) {
    try {
        console.log('Received editedData:', editedData);

        const pool = await sql.connect(config);
        const request = pool.request();

        // Setting input parameters for the query
        request.input('Licencia', sql.VarChar, licencia);

        // Constructing the SQL query
        let query = 'UPDATE Conductores SET ';
        let updates = [];
        if (editedData.editName) {
            updates.push('Nombre = @Nombre');
            request.input('Nombre', sql.VarChar, editedData.editName);
        }
        if (editedData.editPhone) {
            updates.push('Telefono = @Telefono');
            request.input('Telefono', sql.VarChar, editedData.editPhone);
        }
        if (editedData.editSalary) {
            updates.push('Salario = @Salario');
            request.input('Salario', sql.Int, editedData.editSalary);
        }
        if (editedData.editHireDate) {
            updates.push('FechaContratacion = @FechaContratacion');
            request.input('FechaContratacion', sql.Date, editedData.editHireDate);
        }
        if (editedData.editAddress) {
            updates.push('Direccion = @Direccion');
            request.input('Direccion', sql.VarChar, editedData.editAddress);
        }

        // Check if there are any updates to be made
        if (updates.length === 0) {
            throw new Error('No valid fields to update');
        }

        query += updates.join(', ');
        query += ' WHERE Licencia = @Licencia';

        // Executing the update query
        await request.query(query);

        console.log(`Conductor with Licencia ${licencia} updated successfully`);
    } catch (err) {
        console.error("Error executing update query: ", err);
        throw err;
    }
}

export async function deleteConductor(licencia) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        // Setting input parameter for the query
        request.input('Licencia', sql.VarChar, licencia);

        // Constructing the SQL query
        const query = 'DELETE FROM Conductores WHERE Licencia = @Licencia';

        // Executing the delete query
        await request.query(query);

        console.log(`Conductor with Licencia ${licencia} deleted successfully`);
    } catch (err) {
        console.error("Error executing delete query: ", err);
        throw err;
    }
}

export async function getVehiculos() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM Vehiculos");
        return result.recordset;
    } catch (err) {
        console.error("Error executing query: ", err);
        throw err;
    }
}

export async function addVehiculo(newVehiculoData) {
    console.log('Received newVehiculoData:', newVehiculoData);
    try {
        const pool = await sql.connect(config);
        const request = pool.request();
        
        request.input('Matricula', sql.VarChar, newVehiculoData.Matricula);
        request.input('Marca', sql.VarChar, newVehiculoData.Marca);
        request.input('Modelo', sql.VarChar, newVehiculoData.Modelo);
        request.input('Año', sql.Int, newVehiculoData.Año);
        request.input('Capacidad', sql.Int, newVehiculoData.Capacidad);
        request.input('TipoVehiculo', sql.VarChar, newVehiculoData.TipoVehiculo);

        const query = `
            INSERT INTO Vehiculos (Matricula, Marca, Modelo, Año, Capacidad, TipoVehiculo)
            VALUES (@Matricula, @Marca, @Modelo, @Año, @Capacidad, @TipoVehiculo)
        `;

        await request.query(query);
    } catch (err) {
        console.error('Error executing insert query:', err);
        throw err;
    }
}

export async function editVehiculo(originalMatricula, updatedVehiculoData) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('OriginalMatricula', sql.VarChar, originalMatricula);
        request.input('Matricula', sql.VarChar, updatedVehiculoData.Matricula);
        request.input('Marca', sql.VarChar, updatedVehiculoData.Marca);
        request.input('Modelo', sql.VarChar, updatedVehiculoData.Modelo);
        request.input('Año', sql.Int, updatedVehiculoData.Año);
        request.input('Capacidad', sql.Int, updatedVehiculoData.Capacidad);
        request.input('TipoVehiculo', sql.VarChar, updatedVehiculoData.TipoVehiculo);

        const query = `
            UPDATE Vehiculos
            SET Matricula = @Matricula,
                Marca = @Marca,
                Modelo = @Modelo,
                Año = @Año,
                Capacidad = @Capacidad,
                TipoVehiculo = @TipoVehiculo
            WHERE Matricula = @OriginalMatricula
        `;

        await request.query(query);
    } catch (err) {
        console.error('Error executing update query:', err);
        throw err;
    }
}

export async function deleteVehiculo(matricula) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();
        request.input('Matricula', sql.VarChar, matricula);
        await request.query('DELETE FROM Vehiculos WHERE Matricula = @Matricula');
    } catch (err) {
        console.error('Error executing delete query:', err);
        throw err;
    }
}

export async function getRutas() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM Rutas");
        return result.recordset;
    } catch (err) {
        console.error("Error executing query: ", err);
        throw err;
    }
}

export async function addRuta(newRutaData) {
    console.log('Received newRutaData:', newRutaData);
    try {
        const pool = await sql.connect(config);
        const request = pool.request();
        
        request.input('Origen', sql.VarChar, newRutaData.Origen);
        request.input('Destino', sql.VarChar, newRutaData.Destino);
        request.input('Distancia', sql.Float, newRutaData.Distancia);
        request.input('DuracionEstimada', sql.Int, newRutaData.DuracionEstimada);

        const query = `
            INSERT INTO Rutas (Origen, Destino, Distancia, DuracionEstimada)
            VALUES (@Origen, @Destino, @Distancia, @DuracionEstimada)
        `;

        await request.query(query);
    } catch (err) {
        console.error('Error executing insert query:', err);
        throw err;
    }
}

export async function updateRuta(IDRuta, Origen, Destino, Distancia, DuracionEstimada) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('IDRuta', sql.Int, IDRuta);
        request.input('Origen', sql.VarChar, Origen);
        request.input('Destino', sql.VarChar, Destino);
        request.input('Distancia', sql.Float, Distancia);
        request.input('DuracionEstimada', sql.Int, DuracionEstimada);

        const query = `
            UPDATE Rutas
            SET Origen = @Origen, Destino = @Destino, Distancia = @Distancia, DuracionEstimada = @DuracionEstimada
            WHERE IDRuta = @IDRuta
        `;

        await request.query(query);
    } catch (error) {
        console.error('Error updating ruta:', error);
        throw error;
    }
}


export async function deleteRuta(IDRuta) {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        request.input('IDRuta', sql.Int, IDRuta);

        const query = `
            DELETE FROM Rutas
            WHERE IDRuta = @IDRuta
        `;

        await request.query(query);
    } catch (error) {
        console.error('Error deleting ruta:', error);
        throw error;
    }
}
