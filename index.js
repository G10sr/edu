const express = require('express');
const session = require('express-session');
const { readFile } = require('fs').promises;
const os = require('os');

const app = express();
const port = 8000;

// Obtener la dirección IP de la máquina
const networkInterfaces = os.networkInterfaces();
let appip = null;

// Buscar la primera interfaz válida con IPv4 y que no sea interna
for (const ifaceName in networkInterfaces) {
  const iface = networkInterfaces[ifaceName].find((details) =>
    details.family === 'IPv4' && !details.internal
  );

  if (iface) {
    appip = iface.address;
    break; // Usamos la primera interfaz no interna (no loopback)
  }
}

// Mostrar la dirección de la aplicación
if (appip) {
  const appAddress = 'http://' + appip + ':' + port + '/';
  console.log('App Address:', appAddress);
} else {
  console.log('No se encontró una interfaz de red válida.');
}

// Configuración de sesiones
app.use(session({
    secret: 'saul2905',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
}));
app.use((req, res, next) => {
    if (!req.session.userlogged) {
        req.session.userlogged = 4; // Asigna un valor predeterminado si no existe
    }
    next();
});

app.use(express.static('public'));

app.get('/', async (req, res) => {
  res.send(await readFile('./public/html/inicio.html', 'utf-8'));
});

app.get('/manager.html', async (req, res) => {
  res.send(await readFile('./public/html/managerreportes.html', 'utf-8'));
});

app.get('/manager2.html', async (req, res) => {
  res.send(await readFile('./public/html/manageranuncios.html', 'utf-8'));
});
app.get('/manager3.html', async (req, res) => {
    res.send(await readFile('./public/html/managerusuario.html', 'utf-8'));
  });

app.get('/about.html', async (req, res) => {
  res.send(await readFile('./public/html/about.html', 'utf-8'));
});

app.get('/inicio.html', async (req, res) => {
  res.send(await readFile('./public/html/inicio.html', 'utf-8'));
});

app.get('/iniciosesion.html', async (req, res) => {
  res.send(await readFile('./public/html/iniciosesion.html', 'utf-8'));
});

app.get('/reportes.html', async (req, res) => {
  res.send(await readFile('./public/html/reportes.html', 'utf-8'));
});

app.get('/anuncios.html', async (req, res) => {
  res.send(await readFile('./public/html/anuncios.html', 'utf-8'));
});

app.get('/mapa.html', async (req, res) => {
  res.send(await readFile('./public/html/mapa.html', 'utf-8'));
});

app.get('/registro.html', async (req, res) => {
  res.send(await readFile('./public/html/registro.html', 'utf-8'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
// app.listen(process.env.PORT || 3000, () => console.log('Disponible en http://localhost:3000 '));


///////////////////////////////////////////// CONEXION
const mysql = require('mysql');
const { hrtime } = require('process');
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sqluser',
    password: 'cactus12345;raiz12345.S',
    database: 'edu'
})

connection.connect((err) => {
    if (err) throw err;
    console.log('La conexión fue exitosa');
});


//LOGIN

app.post('/enviarDatos', (req, res) => {
    const querysesion = 'SELECT * FROM usuarios';

    connection.query(querysesion, (error, resultsesion) => {
        if (error) {
            return next(error);
        }
        const user = resultsesion.map(item => item.email);
        const password = resultsesion.map(item => item.password);
        const permiso = resultsesion.map(item => item.permiso);
        const { getuser, getpassword } = req.body;
        var bol = 0;

        for (var i = 0; i < user.length; i++) {
            if (getuser == user[i] && getpassword == password[i]) {
                if (permiso[i] == true) {
                    bol = 1;
                    req.session.userlogged = i + 1; 
                    return res.json(bol);
                }
                bol = 2;
                return res.json(bol);
            }
        }
        return res.json(bol);
    });
});


//ANUNCIOS

app.get('/api/anuncios', (req,res) => {
   const queryanun = 'SELECT anuncios.*, usuarios.name, lugar.aula AS aula, (SELECT COUNT(id) FROM anuncios) AS total FROM anuncios JOIN usuarios ON anuncios.user_id = usuarios.id JOIN lugar ON anuncios.lugar = lugar.id;';

   connection.query(queryanun, (error, resultsan) => {
      if (error) {
         return next(error);
         
      }      
    req.session.numeroids = resultsan[0].total;
   res.json(resultsan);
   
   });
}); 

app.post('/enviarAnuncio', (req, res) => {
   var bol = 0; 
   const { titulo, reporte, fecha, lugar } = req.body;
   const sql = `INSERT INTO anuncios (nombre, descripcion, fecha, vigencia, lugar, user_id) VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(sql, [titulo, reporte, fecha, 2, lugar, req.session.userlogged], (err, result) => {
        if (err) {
            console.error('Error al insertar datos en la base de datos:', err);
            res.status(500).send('Error al insertar datos');
        } else {
            bol = 1;
            res.json(bol);
        }
    });
});
//REGISTRO
app.post('/registrarUsuario', (req, res) => {
   const { getname1, getuser1, getpassword1 } = req.body;
   
   // Verifica si el usuario ya existe
   const sql1 = `SELECT COUNT(*) AS userCount FROM usuarios WHERE email = ?`;
   connection.query(sql1, [getuser1], (err, result) => { 
       if (err) {
           console.error('Error al verificar el usuario en la base de datos:', err);
           return res.status(500).send('Error en el servidor');
       }
       if (result[0].userCount > 0) { 
           bol1 = 2; 
           return res.json(bol1);
       } else {
           const sql2 = `INSERT INTO usuarios (name, email, password, rol_id, permiso) VALUES (?, ?, ?, 0, 0)`;
           connection.query(sql2, [getname1, getuser1, getpassword1], (err, result) => {
               if (err) {
                   console.error('Error al insertar datos en la base de datos:', err);
                   return res.status(500).send('Error al registrar el usuario');
               } else {
                   bol1 = 1; 
                   return res.json(bol1);
               }
           });
       }
   });
});
// REPORTES
app.get('/api/reportes', (req,res) => {
   const queryrep = 'SELECT reportes.*, usuarios.name, lugar.aula AS aula, (SELECT COUNT(id) FROM reportes) AS total FROM reportes JOIN usuarios ON reportes.user_id = usuarios.id JOIN lugar ON reportes.lugar = lugar.id;';

   connection.query(queryrep, (error, resultsrep) => {
      if (error) {
         return next(error);

      }      
   res.json(resultsrep);
    req.session.numberofids = resultsrep[0].total;
   });
}); 
var rolId = 0;
var permisoid = 0;
//Roles general
app.get('/api/roles', (req, res) => {  
    connection.query(
      'SELECT rol_id FROM usuarios WHERE id = ?',
      [req.session.userlogged],
      (error, results) => {
          if (error) {
              return res.status(500).json({ message: 'Error en la base de datos', error });
          }
          if (results.length == 0) {
              return res.status(404).json({ message: 'Usuario no encontrado' });
          }
          rolId = results.map(item => item.rol_id);
         res.json({rolId});
      }
  );
});
app.get('/api/verificacion', (req, res) => {  
   connection.query(
     'SELECT permiso FROM usuarios WHERE id = ?',
     [req.session.userlogged],
     (error, results) => {
         if (error) {
             return res.status(500).json({ message: 'Error en la base de datos', error });
         }
         if (results.length == 0) {
             return res.status(404).json({ message: 'Usuario no encontrado' });
         }
        permisoid = results.map(item => item.permiso);
        res.json({permisoid});
     }
 );
});
//////

app.post('/enviarReporte', (req, res) => {
   var bol = 0; 
   const { titulo, reporte, urgencia, fecha, lugar, problema } = req.body;
   const sql = `INSERT INTO reportes (nombre, descripcion, fecha, urgencia, vigencia, tipo_reporte, lugar, user_id) VALUES (?, ?, ?, ?, ?, ?,?,?)`;
    connection.query(sql, [titulo, reporte, fecha, urgencia, 2, problema, lugar, req.session.userlogged], (err, result) => {
        if (err) {
            console.error('Error al insertar datos en la base de datos:', err);
            res.status(500).send('Error al insertar datos');
        } else {
            bol = 1;
            res.json(bol);
        }
    });
});
///Cambiar estado de reporte
app.post('/api/update-report', (req, res) => {
   let { reportId, newVigencia } = req.body;
   connection.query(`UPDATE reportes SET vigencia = ? WHERE id = ?`, [newVigencia, reportId], (err, results) => {
       if (err) {
           res.status(500).json({ error: 'Error updating report' });
       } else {
           res.json({ message: 'Report updated successfully' });
       }
   });
});
app.post('/api/update-anuncios', (req, res) => {
    let { reportId, newVigencia } = req.body;
    connection.query(`UPDATE anuncios SET vigencia = ? WHERE id = ?`, [newVigencia, reportId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error updating report' });
        } else {
            res.json({ message: 'Report updated successfully' });
        }
    });
 });
///////////////////////////////////////////////

///Notificacion

app.get('/contarReportes', (req, res, next) => {
    let bol = 0; 
    const queryrep = 'SELECT COUNT(id) AS total FROM reportes;'; 

    connection.query(queryrep, (error, resultsrep) => {
        if (error) {
            return next(error);
        }
        var cantidadActualReportes = resultsrep[0].total;
        if (cantidadActualReportes > req.session.numberofids){
            bol = 1;
            res.json(bol);
        }
        else{
            bol = 0;
            res.json(bol);
        }
    });
});

app.get('/contarAnuncios', (req, res, next) => {
    let bol = 0; 
    const queryrep = 'SELECT COUNT(id) AS total FROM anuncios;'; 

    connection.query(queryrep, (error, resultsanun) => {
        if (error) {
            return next(error);
        }
        var cantidadActualAnuncios = resultsanun[0].total;
        if (cantidadActualAnuncios > req.session.numeroids){
            bol = 1;
            res.json(bol);
        }
        else{
            bol = 0;
            res.json(bol);
        }
    });
});
//Manager anuncios 
app.get('/api/usuarios', (req, res) => {
    const queryUsuarios = `
        SELECT 
            usuarios.id,
            usuarios.name, 
            usuarios.email, 
            usuarios.permiso, 
            usuarios.rol_id, 
            roles.descripcion AS rol
        FROM 
            usuarios
        JOIN 
            roles ON usuarios.rol_id = roles.id
         ORDER BY usuarios.id DESC;
    `;

    connection.query(queryUsuarios, (error, results) => {
        if (error) {
            console.error('Error al obtener los usuarios:', error);
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }
        res.json(results); // Devolver los resultados al frontend
    });
});

// Endpoint para actualizar el rol del usuario

app.post('/api/update-user', (req, res) => {
    const { userId, newRol, newPermiso } = req.body;

    const query = 'UPDATE usuarios SET rol_id = ?, permiso = ? WHERE id = ?';

    connection.query(query, [newRol, newPermiso, userId], (error, results) => {
        if (error) {
            console.error('Error al actualizar el usuario:', error);
            return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }

        res.json({ success: true, message: 'Usuario actualizado correctamente' });
    });
});
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.status(200).send('Sesión cerrada');
    });
});

//MAPA 
app.get('/api/mapa', (req,res) => {
    const queryrep = 'SELECT reportes.*, lugar.*FROM reportes JOIN lugar ON reportes.lugar = lugar.id;';
 
    connection.query(queryrep, (error, resultsrep) => {
       if (error) {
          return next(error);
 
       }      
    res.json(resultsrep);
    });
 }); 

 //selectores

 app.get('/api/selector', (req, res, next) => {
    const queryrep = 'SELECT id, aula FROM lugar;';  // Consulta sólo los campos necesarios
    
    connection.query(queryrep, (error, resultsrep) => {
        if (error) {
            return next(error);
        }
        res.json(resultsrep);  // Enviar los resultados como JSON al cliente
    });
});