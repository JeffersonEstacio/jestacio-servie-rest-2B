# jestacio-servie-rest-2B
Running Locally
* `npm start`
* In the browser go to http://localhost:3000/login.
})
=================================================================================================
LOGIN
=================================================================================================
Vamos a configurar nuestra petición post la cual funcionara con /login al igual que las demás esta tendrá una respuesta y una petición, pero ahora al momento de loggearnos 
vamos a tener una autenticación, dado que si el usuario no existe devolverá un error con paréntesis en el (usuario) y si la contraseña esta mal en cambio devolverá un error 
con paréntesis en la (contraseña), y si el usuario no existe también, y por su puesto si hay un error con la de datos lo mismo un mensaje con la clase de error y en caso de 
ser un usuario válido ontenemos el token.

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        // Errores en la conexión o consulta con la BDD
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        // El usuario no existe en la BDD
        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }
        // La contraseña no coincide
        if (!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }
        // Genrar el token
        let token = jwt.sign({
            usuario: usuarioDB
        },   process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN}
        )
        // Si todo va bien
        res.json({
            ok: true,
            token
        })         

    });

})
===================================================================================================
USUARIO
===================================================================================================
creamos nuestras peticiones con express, en este caso una petición get, que funcionara con /usuario y con la ayuda de una función con una respuesta y una petición tomara los 
valores ingresados por teclado para su respectivo uso. Dentro de la función establecemos un limite de registros puesto que luego de tener bastantes y consumirlos al hacer la 
llamada nos puede votar un resultado enorme, entonces esto a niveles macro representa un coste computacional grande, luego establecemos una serie de condicionales para filtrar 
una búsqueda, ya sea esta por fecha u hora. Como tenemos declarada una función para pedir y para solicitar, en caso de que esta petición sea rechazada por alguna razón con 
respecto a los datos, nos enviara un mensaje de que los campos son requeridos.

app.get('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 10;
    hasta = Number(hasta);

    let soli = "";
    let fechaSoli = req.query.fecha || null;
    let horaSoli = req.query.hora || null;
    
    if (fechaSoli === null && horaSoli === null) {
        soli = {

        }
    }
    if (fechaSoli != null && horaSoli != null) {
        soli = {
            fecha: fechaSoli,
            hora: horaSoli
        }
    }
    if (fechaSoli != null && horaSoli === null) {
        soli = {
            fecha: fechaSoli
        }
    }

    if (horaSoli != null && fechaSoli === null) {
        soli = {
            hora: horaSoli
        }
    }


    Usuario.find(soli, 'caja fecha hora')
        .skip(desde)
        .limit(hasta)
        .exec((err, cajas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count(soli, (err, conteo) => {
                res.json({
                    ok: true,
                    registros: conteo,
                    cajas
                })
            })
        })
})
================================================================================================
USUARIO
================================================================================================
Procedemos a configurar nuestra petición post, para poder enviar campos y que la aplicación los lea, al igual que en el get tenemos una petición y una respuesta, en caso de 
haber un error el sistema envía una alerta sobre el campo que este dando problemas.

app.post('/usuario',[verificaToken, verificaAdminRole], function(req, res) {
    let fecha = new Date()
    let body = req.body;
    let info = new Usuario({
        caja: body.caja,
        nombre: body.nombre,
        password: body.password,
        email: body.email,
        fecha: fecha.getDate() + "/" + fecha.getMonth() + 1 + "/" + fecha.getFullYear(),
        hora: fecha.getHours() + ":" + fecha.getMinutes()
    })
    info.save((err, cajaDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                Usuario: cajaDB
            })
        }

    })
})
=================================================================================================
USUARIO
=================================================================================================
Finalmente, nuestra ultima app de express es la de eliminar un registro, para esto la aplicación primero buscara a el registro por su ID en la base de datos, y si existe 
mediante el uso del /usuario/id podremos eliminar un registro, en caso de no existir dicho registro resultara un error de que el registro no es válido o no existe y exportamos.

app.delete('/usuario/:id',[verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, regCajaEliminado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (regCajaEliminado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Este registro no existe '
                }
            })
        }
        res.json({
            ok: true,
            usuario: regCajaEliminado
        })
    })
})
