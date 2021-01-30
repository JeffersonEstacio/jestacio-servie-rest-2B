const express = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticación')

const app = express();

app.get("/user", verificaToken, function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;
  limite = Number(limite);

  Usuario.find({estado:true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err,
        });
      }

      Usuario.count({estado:true}, (err, conteo) => {
        res.json({
          ok: true,
          registros: conteo,
          usuarios
        });
      });
  });
});

app.post("/user", [verificaToken, verificaAdminRole] , function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
        ok: true,
        usuario: usuarioDB
      });
  });

});

app.put("/user", [verificaToken, verificaAdminRole] , function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  

  Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true, context: 'query'}, (err, usuarioDB) =>{

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });

  });
});

app.delete("/user/:id", [verificaToken, verificaAdminRole] , function (req, res) {
  let id = req.params.id;

  let cambiarEstado = {
    estado: false
  }

  // Usuario.findByIdAndDelete(id, (err, usuarioEliminado) => {
  Usuario.findByIdAndUpdate(id, cambiarEstado, {nre: true, context:'query'}, (err, usuarioDB) => {
    if (err){
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    if (!usuarioDB){
      return res.status(400).json({
        ok: false,
        error: {
          message: 'Usuario no encontrado en la BDD'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioDB
    });

  });

});

module.exports = app;