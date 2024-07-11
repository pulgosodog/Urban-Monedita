const express = require("express");
const sql = require("mssql");

const app = express();

// SQL Server configuration
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

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

// Define route for fetching data from SQL Server
app.get("/", (request, response) => {
    // Execute a SELECT query
    new sql.Request().query("SELECT * FROM conductores", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            response.send(result.recordset); // Send query result as response
            console.dir(result.recordset);
        }
    });
});

// Start the server on port 3000
app.listen(4000, () => {
    console.log("Listening on port 3000...");
});