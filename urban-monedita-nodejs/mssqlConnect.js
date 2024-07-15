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
