import { getConnection, sql } from "./dbconection.js";

const getConductores = () => {
    try {
        const pool = getConnection()
        const result = pool.request().query("SELECT Licencia, Nombre, Telefono, Direccion, FechaContratacion, Salario FROM Conductores");
        console.log(result);
        console.log("Conductores listed!")
    }
    catch(error) {
        console.error(error);
    } 
}

getConductores();

