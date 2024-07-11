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

async function connectToDatabase() {
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

export {connectToDatabase}
