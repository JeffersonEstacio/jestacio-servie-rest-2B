const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    caja: {
        type: Number,
        required: [true, "El campo caja es obligatorio"]
    },
    fecha: {
        type: String,
        required: [true, "La fecha es obligatoria"]
    },
    hora: {
        type: String,
        required: [true, "La hora es oblgatorio"]
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El e-mail es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }
});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser único'});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObjet = user.toObject();
    delete userObjet.password;

    return userObjet;
}

module.exports = mongoose.model('Usuario', usuarioSchema)