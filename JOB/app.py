from flask import Flask, render_template, request, redirect, url_for, flash
import pyodbc

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# Configuración de la conexión ODBC
conn_str = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    'SERVER=DESKTOP-87BTJDM;'
    'DATABASE=TestDatabase;'
    'Trusted_Connection=yes;'
    'TrustServerCertificate=yes;'
)
@app.route('/')
def index():
    return render_template('index.html')

def get_db_connection():
    try:
        conn = pyodbc.connect(conn_str)
        print("Conexión exitosa a la base de datos")
        return conn
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None


def execute_query(query, params=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        conn.commit()
        flash('Operación exitosa!', 'success')
    except Exception as e:
        flash(f'Error en la operación: {e}', 'danger')
    finally:
        cursor.close()
        conn.close()

def fetch_query(query, params=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Exception as e:
        flash(f'Error al obtener datos: {e}', 'danger')
        return None
    finally:
        cursor.close()
        conn.close()

# Funciones para conductores
@app.route('/conductores')
def conductores():
    query = "SELECT * FROM Conductores"
    conductores = fetch_query(query)
    return render_template('conductores.html', conductores=conductores)

@app.route('/add_conductor', methods=['GET', 'POST'])
def add_conductor():
    if request.method == 'POST':
        nombre = request.form['nombre']
        licencia = request.form['licencia']
        telefono = request.form['telefono']
        direccion = request.form['direccion']
        fecha_contratacion = request.form['fecha_contratacion']
        salario = request.form['salario']

        query = """
            INSERT INTO Conductores (Nombre, Licencia, Telefono, Direccion, FechaContratacion, Salario)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        params = (nombre, licencia, telefono, direccion, fecha_contratacion, salario)

        try:
            execute_query(query, params)
            flash('Conductor añadido con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir el conductor: {e}', 'danger')

        return redirect(url_for('conductores'))

    return render_template('add_conductor.html')

@app.route('/delete_conductor/<int:id_conductor>', methods=['POST'])
def delete_conductor(id_conductor):
    query = "DELETE FROM Conductores WHERE IDConductor = ?"
    params = (id_conductor,)

    try:
        execute_query(query, params)
        flash('Conductor eliminado correctamente!', 'success')
    except Exception as e:
        flash(f'Error al eliminar el conductor: {e}', 'danger')

    return redirect(url_for('conductores'))

# Funciones para vehículos
@app.route('/vehiculos')
def vehiculos():
    query = "SELECT * FROM Vehiculos"
    vehiculos = fetch_query(query)
    return render_template('vehiculos.html', vehiculos=vehiculos)

@app.route('/add_vehiculo', methods=['GET', 'POST'])
def add_vehiculo():
    if request.method == 'POST':
        matricula = request.form['matricula']
        marca = request.form['marca']
        modelo = request.form['modelo']
        anio = request.form['anio']
        capacidad = request.form['capacidad']
        tipo_vehiculo = request.form['tipo_vehiculo']
        fecha_adquisicion = request.form['fecha_adquisicion']
        estado_vehiculo = request.form['estado_vehiculo']

        query = """
            INSERT INTO Vehiculos (Matricula, Marca, Modelo, Anio, Capacidad, TipoVehiculo, FechaAdquisicion, EstadoVehiculo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        params = (matricula, marca, modelo, anio, capacidad, tipo_vehiculo, fecha_adquisicion, estado_vehiculo)

        try:
            execute_query(query, params)
            flash('Vehículo añadido con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir el vehículo: {e}', 'danger')

        return redirect(url_for('vehiculos'))

    return render_template('add_vehiculo.html')

@app.route('/delete_vehiculo/<int:id_vehiculo>', methods=['POST'])
def delete_vehiculo(id_vehiculo):
    query = "DELETE FROM Vehiculos WHERE IDVehiculo = ?"
    params = (id_vehiculo,)

    try:
        execute_query(query, params)
        flash('Vehículo eliminado correctamente!', 'success')
    except Exception as e:
        flash(f'Error al eliminar el vehículo: {e}', 'danger')

    return redirect(url_for('vehiculos'))
# Función para añadir ruta
@app.route('/add_ruta', methods=['GET', 'POST'])
def add_ruta():
    if request.method == 'POST':
        origen = request.form['origen']
        destino = request.form['destino']
        distancia = request.form['distancia']
        duracion_estimada = request.form['duracion_estimada']

        query = """
            INSERT INTO Rutas (Origen, Destino, Distancia, DuracionEstimada)
            VALUES (?, ?, ?, ?)
        """
        params = (origen, destino, distancia, duracion_estimada)

        try:
            execute_query(query, params)
            flash('Ruta añadida con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir la ruta: {e}', 'danger')

        return redirect(url_for('rutas'))

    return render_template('add_ruta.html')


@app.route('/delete_ruta/<int:id_ruta>', methods=['POST'])
def delete_ruta(id_ruta):
    query = "DELETE FROM Rutas WHERE IDRuta = ?"
    params = (id_ruta,)

    try:
        execute_query(query, params)
        flash('Ruta eliminada correctamente!', 'success')
    except Exception as e:
        flash(f'Error al eliminar la ruta: {e}', 'danger')

    return redirect(url_for('rutas'))

# Ingresos y Gastos

@app.route('/ingresos')
def ingresos():
    ingresos = fetch_query("""
        SELECT 
            v.IDViaje, v.CostoViaje, ISNULL(SUM(i.Monto), 0) AS IngresosTotales, 
            ISNULL(SUM(g.Monto), 0) AS GastosTotales,
            ISNULL(SUM(i.Monto), 0) - ISNULL(SUM(g.Monto), 0) AS Ganancia
        FROM Viajes v
        LEFT JOIN Ingresos i ON v.IDViaje = i.IDViaje
        LEFT JOIN Gastos g ON v.IDViaje = g.IDViaje
        GROUP BY v.IDViaje, v.CostoViaje
    """)
    return render_template('ingresos.html', ingresos=ingresos)

@app.route('/gastos')
def gastos():
    gastos = fetch_query("SELECT * FROM Gastos")
    return render_template('gastos.html', gastos=gastos)

@app.route('/add_gasto', methods=['GET', 'POST'])
def add_gasto():
    if request.method == 'POST':
        id_viaje = request.form['id_viaje']
        tipo_gasto = request.form['tipo_gasto']
        monto = request.form['monto']
        fecha = request.form['fecha']
        descripcion = request.form['descripcion']

        query = """
            INSERT INTO Gastos (IDViaje, TipoGasto, Monto, Fecha, Descripcion)
            VALUES (?, ?, ?, ?, ?)
        """
        params = (id_viaje, tipo_gasto, monto, fecha, descripcion)

        try:
            execute_query(query, params)
            flash('Gasto añadido con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir el gasto: {e}', 'danger')

        return redirect(url_for('gastos'))

    return render_template('add_gasto.html')

# Función para añadir ruta
@app.route('/add_ruta', methods=['GET', 'POST'])
def add_ruta():
    if request.method == 'POST':
        origen = request.form['origen']
        destino = request.form['destino']
        distancia = request.form['distancia']
        duracion_estimada = request.form['duracion_estimada']

        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            # Debug: Imprime los valores para verificar que se reciben correctamente
            print(f"Valores recibidos: origen={origen}, destino={destino}, distancia={distancia}, duracion_estimada={duracion_estimada}")

            query = """
                INSERT INTO Rutas (Origen, Destino, Distancia, DuracionEstimada)
                VALUES (?, ?, ?, ?)
            """
            params = (origen, destino, distancia, duracion_estimada)

            cursor.execute(query, params)
            conn.commit()
            cursor.close()
            conn.close()
            flash('Ruta añadida con éxito!', 'success')
            return redirect(url_for('rutas'))
        except Exception as e:
            flash(f'Error al añadir la ruta: {e}', 'danger')

    return render_template('add_ruta.html')

# Función para calcular ingresos generados
def calculate_ingresos_generados(costo_viaje):
    factor_ganancia = 1.5
    ingresos_generados = float(costo_viaje) * factor_ganancia
    return round(ingresos_generados, 2)

# Funciones para cuentas de pasajeros
@app.route('/cuentas_pasajeros')
def cuentas_pasajeros():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM CuentasPasajeros")
    cuentas_pasajeros = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('cuentas_pasajeros.html', cuentas_pasajeros=cuentas_pasajeros)

@app.route('/add_cuenta_pasajero', methods=['GET', 'POST'])
def add_cuenta_pasajero():
    if request.method == 'POST':
        nombre = request.form['nombre']
        email = request.form['email']
        telefono = request.form['telefono']
        direccion = request.form['direccion']  # Nuevo campo de dirección
        fecha_registro = request.form['fecha_registro']  # Nuevo campo de fecha de registro

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO CuentasPasajeros (Nombre, Email, Telefono, Direccion, FechaRegistro)
                VALUES (?, ?, ?, ?, ?)
            """, (nombre, email, telefono, direccion, fecha_registro))
            conn.commit()
            cursor.close()
            conn.close()
            flash('Cuenta de pasajero añadida con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir la cuenta de pasajero: {e}', 'danger')

        return redirect(url_for('cuentas_pasajeros'))

    return render_template('add_cuenta_pasajero.html')

@app.route('/delete_cuenta_pasajero/<int:id_cuenta_pasajero>', methods=['POST'])
def delete_cuenta_pasajero(id_cuenta_pasajero):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM CuentasPasajeros WHERE IDCuentaPasajero = ?", (id_cuenta_pasajero,))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Cuenta de pasajero eliminada correctamente!', 'success')
    except Exception as e:
        flash(f'Error al eliminar la cuenta de pasajero: {e}', 'danger')

    return redirect(url_for('cuentas_pasajeros'))
@app.route('/historial_viajes')
def historial_viajes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT hv.IDHistorial, cp.Nombre AS Pasajero, v.IDViaje
        FROM HistorialViajes hv
        JOIN CuentasPasajeros cp ON hv.IDCuenta = cp.IDCuenta
        JOIN Viajes v ON hv.IDViaje = v.IDViaje
    """)
    historial_viajes = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('historial_viajes.html', historial_viajes=historial_viajes)

# Función para agregar historial de viaje
@app.route('/add_historial_viaje', methods=['GET', 'POST'])
def add_historial_viaje():
    if request.method == 'POST':
        id_cuenta = request.form['id_cuenta']
        id_viaje = request.form['id_viaje']

        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO HistorialViajes (IDCuenta, IDViaje)
                VALUES (?, ?)
            """, (id_cuenta, id_viaje))
            conn.commit()
            cursor.close()
            conn.close()
            flash('Historial de viaje añadido con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir el historial de viaje: {e}', 'danger')

        return redirect(url_for('historial_viajes'))

    return render_template('add_historial_viaje.html')

@app.route('/precios_viajes')
def precios_viajes():
    query = """
        SELECT v.IDViaje, v.CostoViaje, ISNULL(SUM(i.Monto), 0) AS IngresosTotales, 
               ISNULL(SUM(g.Monto), 0) AS GastosTotales,
               ISNULL(SUM(i.Monto), 0) - ISNULL(SUM(g.Monto), 0) AS Ganancia
        FROM Viajes v
        LEFT JOIN Ingresos i ON v.IDViaje = i.IDViaje
        LEFT JOIN Gastos g ON v.IDViaje = g.IDViaje
        GROUP BY v.IDViaje, v.CostoViaje
    """
    precios_viajes = fetch_query(query)
    return render_template('precios_viajes.html', precios_viajes=precios_viajes)


if __name__ == '__main__':
    app.run(debug=True)
