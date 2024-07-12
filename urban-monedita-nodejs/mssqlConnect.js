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
