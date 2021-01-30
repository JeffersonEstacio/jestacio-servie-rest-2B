const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

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

});



module.exports = app;