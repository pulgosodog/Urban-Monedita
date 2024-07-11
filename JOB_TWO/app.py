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


def execute_query(query, params=None, fetch=False):
    conn = get_db_connection()
    if conn is None:
        print("No se pudo establecer la conexión a la base de datos.")
        return None
    cursor = conn.cursor()
    try:
        if params:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        if fetch:
            results = cursor.fetchall()
        else:
            results = None
        conn.commit()
        cursor.close()
        conn.close()
        print(f"Resultados de la consulta: {results}")
        return results
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Error en execute_query: {e}")
        return None
    
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
@app.route('/edit_conductor/<int:id_conductor>', methods=['GET', 'POST'])
def edit_conductor(id_conductor):
    if request.method == 'POST':
        nombre = request.form['nombre']
        licencia = request.form['licencia']
        telefono = request.form['telefono']
        direccion = request.form['direccion']
        fecha_contratacion = request.form['fecha_contratacion']
        salario = request.form['salario']

        query = """
            UPDATE Conductores
            SET Nombre = ?, Licencia = ?, Telefono = ?, Direccion = ?, FechaContratacion = ?, Salario = ?
            WHERE IDConductor = ?
        """
        params = (nombre, licencia, telefono, direccion, fecha_contratacion, salario, id_conductor)

        try:
            execute_query(query, params)
            flash('Conductor actualizado con éxito!', 'success')
        except Exception as e:
            flash(f'Error al actualizar el conductor: {e}', 'danger')

        return redirect(url_for('conductores'))

    query = "SELECT * FROM Conductores WHERE IDConductor = ?"
    conductor = fetch_query(query, (id_conductor,))[0]
    return render_template('edit_conductor.html', conductor=conductor)

# Funciones para vehículos
@app.route('/vehiculos')
def vehiculos():
    query = "SELECT * FROM Vehiculos"
    vehiculos = fetch_query(query)
    return render_template('vehiculos.html', vehiculos=vehiculos)
@app.route('/add_vehiculo', methods=['GET', 'POST'])
def add_vehiculo():
    if request.method == 'POST':
        try:
            matricula = request.form['matricula']
            marca = request.form['marca']
            modelo = request.form['modelo']
            año = int(request.form['año'])
            capacidad = int(request.form['capacidad'])
            tipo_vehiculo = request.form['tipo_vehiculo']
            fecha_adquisicion = request.form['fecha_adquisicion']
            estado_vehiculo = request.form['estado_vehiculo']

            # Imprimir valores para depuración
            print(f"Matricula: {matricula}, Marca: {marca}, Modelo: {modelo}, Año: {año}, Capacidad: {capacidad}, TipoVehiculo: {tipo_vehiculo}, FechaAdquisicion: {fecha_adquisicion}, EstadoVehiculo: {estado_vehiculo}")

            query = """
                INSERT INTO Vehiculos (Matricula, Marca, Modelo, Año, Capacidad, TipoVehiculo, FechaAdquisicion, EstadoVehiculo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            params = (matricula, marca, modelo, año, capacidad, tipo_vehiculo, fecha_adquisicion, estado_vehiculo)

            execute_query(query, params)
            flash('Vehículo añadido con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir el vehículo: {e}', 'danger')
            print(f"Error al añadir el vehículo: {e}")

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
@app.route('/edit_vehiculo/<int:id_vehiculo>', methods=['GET', 'POST'])
def edit_vehiculo(id_vehiculo):
    if request.method == 'POST':
        matricula = request.form['matricula']
        marca = request.form['marca']
        modelo = request.form['modelo']
        año = int(request.form['año'])  # Conversión a entero
        capacidad = int(request.form['capacidad'])  # Conversión a entero
        tipo_vehiculo = request.form['tipo_vehiculo']
        fecha_adquisicion = request.form['fecha_adquisicion']
        estado_vehiculo = request.form['estado_vehiculo']

        query = """
            UPDATE Vehiculos
            SET Matricula = ?, Marca = ?, Modelo = ?, Año = ?, Capacidad = ?, TipoVehiculo = ?, FechaAdquisicion = ?, EstadoVehiculo = ?
            WHERE IDVehiculo = ?
        """
        params = (matricula, marca, modelo, año, capacidad, tipo_vehiculo, fecha_adquisicion, estado_vehiculo, id_vehiculo)

        try:
            execute_query(query, params)
            flash('Vehículo actualizado con éxito!', 'success')
        except Exception as e:
            flash(f'Error al actualizar el vehículo: {e}', 'danger')

        return redirect(url_for('vehiculos'))

    query = "SELECT * FROM Vehiculos WHERE IDVehiculo = ?"
    vehiculo = fetch_query(query, (id_vehiculo,))
    
    if not vehiculo:
        flash('Vehículo no encontrado.', 'danger')
        return redirect(url_for('vehiculos'))

    return render_template('edit_vehiculo.html', vehiculo=vehiculo[0])

@app.route('/rutas')
def rutas():
    query = "SELECT * FROM Rutas"
    rutas = fetch_query(query)
    return render_template('rutas.html', rutas=rutas)

@app.route('/add_ruta', methods=['GET', 'POST'])
def add_ruta():
    if request.method == 'POST':
        origen = request.form['origen']
        destino = request.form['destino']
        distancia = request.form['distancia']
        duracion_estimada = request.form['duracion_estimada']

        # Verificar los valores recibidos
        print(f"Origen: {origen}, Destino: {destino}, Distancia: {distancia}, Duración Estimada: {duracion_estimada}")

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
            print(f"Error: {e}")  # Imprimir error en la consola para depuración

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

@app.route('/edit_ruta/<int:id_ruta>', methods=['GET', 'POST'])
def edit_ruta(id_ruta):
    if request.method == 'POST':
        origen = request.form['origen']
        destino = request.form['destino']
        distancia = request.form['distancia']
        duracion_estimada = request.form['duracion_estimada']

        query = """
            UPDATE Rutas
            SET Origen = ?, Destino = ?, Distancia = ?, DuracionEstimada = ?
            WHERE IDRuta = ?
        """
        params = (origen, destino, distancia, duracion_estimada, id_ruta)

        try:
            execute_query(query, params)
            flash('Ruta actualizada con éxito!', 'success')
        except Exception as e:
            flash(f'Error al actualizar la ruta: {e}', 'danger')

        return redirect(url_for('rutas'))

    query = "SELECT * FROM Rutas WHERE IDRuta = ?"
    ruta = fetch_query(query, (id_ruta,))[0]
    return render_template('edit_ruta.html', ruta=ruta)

@app.route('/viajes')
def viajes():
    query = "SELECT * FROM Viajes"
    try:
        # Fetch results using fetch_query
        viajes = fetch_query(query)
        if not viajes:
            print("No se recuperaron viajes de la base de datos.")
        return render_template('viajes.html', viajes=viajes)
    except Exception as e:
        flash(f'Error al obtener los viajes: {e}', 'danger')
        print(f"Error al obtener los viajes: {e}")  # Mensaje de depuración
        return redirect(url_for('index'))


@app.route('/add_viaje', methods=['GET', 'POST'])
def add_viaje():
    if request.method == 'POST':
        id_conductor = request.form['id_conductor']
        id_vehiculo = request.form['id_vehiculo']
        id_ruta = request.form['id_ruta']
        hora_salida = request.form['hora_salida']
        hora_entrada = request.form['hora_entrada']
        fecha = request.form['fecha']
        numero_pasajeros = request.form['numero_pasajeros']
        ingreso = request.form['ingreso']
        gasto = request.form['gasto']

        query = """
            INSERT INTO Viajes (IDConductor, IDVehiculo, IDRuta, HoraSalida, HoraEntrada, Fecha, NumeroPasajeros, Ingreso, Gasto)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        params = (id_conductor, id_vehiculo, id_ruta, hora_salida, hora_entrada, fecha, numero_pasajeros, ingreso, gasto)

        try:
            execute_query(query, params)
            flash('Viaje añadido con éxito!', 'success')
        except Exception as e:
            flash(f'Error al añadir el viaje: {e}', 'danger')

        return redirect(url_for('viajes'))

    # Cargar datos para el formulario
    conductores = fetch_query("SELECT IDConductor, Nombre FROM Conductores")
    vehiculos = fetch_query("SELECT IDVehiculo, Matricula, Marca, Modelo FROM Vehiculos")
    rutas = fetch_query("SELECT IDRuta, Origen, Destino FROM Rutas")
    return render_template('add_viaje.html', conductores=conductores, vehiculos=vehiculos, rutas=rutas)


@app.route('/delete_viaje/<int:id_viaje>', methods=['POST'])
def delete_viaje(id_viaje):
    query = "DELETE FROM Viajes WHERE IDViaje = ?"
    try:
        execute_query(query, (id_viaje,))
        flash('Viaje eliminado exitosamente.', 'success')
    except Exception as e:
        flash(f'Error al eliminar el viaje: {e}', 'danger')
    return redirect(url_for('viajes'))

@app.route('/edit_viaje/<int:id_viaje>', methods=['GET', 'POST'])
def edit_viaje(id_viaje):
    if request.method == 'POST':
        id_conductor = request.form['id_conductor']
        id_vehiculo = request.form['id_vehiculo']
        id_ruta = request.form['id_ruta']
        hora_salida = request.form['hora_salida']
        hora_entrada = request.form['hora_entrada']
        fecha = request.form['fecha']
        numero_pasajeros = request.form['numero_pasajeros']
        ingreso = request.form['ingreso']
        gasto = request.form['gasto']

        query = """
            UPDATE Viajes
            SET IDConductor = ?, IDVehiculo = ?, IDRuta = ?, HoraSalida = ?, HoraEntrada = ?, Fecha = ?, NumeroPasajeros = ?, Ingreso = ?, Gasto = ?
            WHERE IDViaje = ?
        """
        params = (id_conductor, id_vehiculo, id_ruta, hora_salida, hora_entrada, fecha, numero_pasajeros, ingreso, gasto, id_viaje)

        try:
            execute_query(query, params)
            flash('Viaje actualizado con éxito!', 'success')
            return redirect(url_for('viajes'))
        except Exception as e:
            flash(f'Error al actualizar el viaje: {e}', 'danger')
            return redirect(url_for('viajes'))

    query = "SELECT * FROM Viajes WHERE IDViaje = ?"
    viaje = fetch_query(query, (id_viaje,))[0]

    # Obtener datos para los selects
    conductores = fetch_query("SELECT IDConductor, Nombre FROM Conductores")
    vehiculos = fetch_query("SELECT IDVehiculo, Matricula FROM Vehiculos")
    rutas = fetch_query("SELECT IDRuta, Origen, Destino FROM Rutas")

    return render_template('edit_viaje.html', viaje=viaje, conductores=conductores, vehiculos=vehiculos, rutas=rutas)



if __name__ == '__main__':
    app.run(debug=True)
