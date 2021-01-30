const express = require('express');
const app = express();
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticación')

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

module.exports = app;